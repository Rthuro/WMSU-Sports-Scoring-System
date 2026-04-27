import { create } from "zustand";
import axios from "axios";
import toast from "react-hot-toast";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:3000" : import.meta.env.VITE_API_URL;

export const useAdminStore = create((set, get) => ({
    admins: [],
    loading: false,
    error: null,

    fetchAdmins: async () => {
        set({ loading: true, error: null });
        try {
            const res = await axios.get(`${BASE_URL}/api/accounts`);
            set({ admins: res.data.data, loading: false });
        } catch (error) {
            const message = error.response?.data?.message || "Failed to fetch admins";
            set({ error: message, loading: false });
            toast.error(message);
        }
    },

    createAdmin: async (data) => {
        set({ loading: true, error: null });
        try {
            const res = await axios.post(`${BASE_URL}/api/accounts`, data);
            const newAdmin = res.data.data.user;
            set({ 
                admins: [newAdmin, ...get().admins], 
                loading: false 
            });
            toast.success("Admin created successfully!");
            return true;
        } catch (error) {
            const message = error.response?.data?.message || "Failed to create admin";
            set({ error: message, loading: false });
            toast.error(message);
            return false;
        }
    },

    googleCreateAdmin: async (firebaseToken) => {
        set({ loading: true, error: null });
        try {
            const res = await axios.post(`${BASE_URL}/api/accounts/google`, {
                token: firebaseToken
            });
            const newAdmin = res.data.data.user;
            set({ 
                admins: [newAdmin, ...get().admins], 
                loading: false 
            });
            toast.success("Admin created with Google account!");
            return true;
        } catch (error) {
            const message = error.response?.data?.message || "Failed to create admin via Google";
            set({ error: message, loading: false });
            toast.error(message);
            return false;
        }
    },

    updateAdmin: async (id, data) => {
        set({ loading: true, error: null });
        try {
            const res = await axios.put(`${BASE_URL}/api/accounts/${id}`, data);
            const updatedAdmin = res.data.data;
            set({
                admins: get().admins.map(admin => 
                    admin.account_id === id ? updatedAdmin : admin
                ),
                loading: false
            });
            toast.success("Admin updated successfully!");
            return true;
        } catch (error) {
            const message = error.response?.data?.message || "Failed to update admin";
            set({ error: message, loading: false });
            toast.error(message);
            return false;
        }
    },

    deleteAdmin: async (id) => {
        set({ loading: true, error: null });
        try {
            await axios.delete(`${BASE_URL}/api/accounts/${id}`);
            set({
                admins: get().admins.filter(admin => admin.account_id !== id),
                loading: false
            });
            toast.success("Admin deleted successfully!");
            return true;
        } catch (error) {
            const message = error.response?.data?.message || "Failed to delete admin";
            set({ error: message, loading: false });
            toast.error(message);
            return false;
        }
    },
}));