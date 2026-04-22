import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";
import toast from "react-hot-toast";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:3000" : import.meta.env.VITE_API_URL;

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,
      error: null,

      login: async (email, password) => {
        set({ loading: true, error: null });
        try {
          const res = await axios.post(`${BASE_URL}/api/accounts/login`, {
            email,
            password,
          });
          const { token, user } = res.data.data;
          set({
            user,
            token,
            isAuthenticated: true,
            loading: false,
          });
          toast.success("Login successful!");
          return true;
        } catch (error) {
          const message = error.response?.data?.message || "Login failed";
          set({ error: message, loading: false });
          toast.error(message);
          return false;
        }
      },

      googleLogin: async (firebaseToken) => {
        set({ loading: true, error: null });
        try {
          const res = await axios.post(`${BASE_URL}/api/accounts/google`, {
            token: firebaseToken
          });
          const { token: jwtToken, user } = res.data.data;
          set({
            user,
            token: jwtToken,
            isAuthenticated: true,
            loading: false,
          });
          toast.success("Login successful!");
          return true;
        } catch (err) {
          const message = err.response?.data?.message || "Google login failed";
          set({ error: message, loading: false });
          toast.error(message);
          return false;
        }
      },

      signup: async (data) => {
        set({ loading: true, error: null });
        try {
          const res = await axios.post(`${BASE_URL}/api/accounts/signup`, data);
          const { token, user } = res.data.data;
          set({
            user,
            token,
            isAuthenticated: true,
            loading: false,
          });
          toast.success("Account created successfully!");
          return true;
        } catch (error) {
          const message = error.response?.data?.message || "Signup failed";
          set({ error: message, loading: false });
          toast.error(message);
          return false;
        }
      },

      googleSignUp: async (firebaseToken) => {
        set({ loading: true, error: null });
        try {
          const res = await axios.post(`${BASE_URL}/api/accounts/google`, {
            token: firebaseToken
          });
          const { token: jwtToken, user } = res.data.data;
          set({
            user,
            token: jwtToken,
            isAuthenticated: true,
            loading: false,
          });
          toast.success("Account created successfully!");
          return true;
        } catch (err) {
          const message = err.response?.data?.message || "Google sign-up failed";
          set({ error: message, loading: false });
          toast.error(message);
          return false;
        }
      },

      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
        toast.success("Logged out successfully");
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
