import { create } from "zustand";
import axios from "axios";
import { toast } from "react-hot-toast";


const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:3000" : import.meta.env.VITE_API_URL;

export const useTeamStore = create((set, get) => ({
    teams: [],
    teamsBySport: [],
    error: null,
    loading: false,

    fetchTeams: async () => {
        set({ loading: true, error: null });
        try {
            const res = await axios.get(`${BASE_URL}/api/teams`);
            set({ teams: res.data.data, loading: false });
        } catch (error) {
            set({ error, loading: false });
        }
    },

    fetchTeamsBySport: async (sportId) => {
        set({ loading: true, error: null });
        try {
            const res = await axios.get(`${BASE_URL}/api/teams/${sportId}`);
            set({ teamsBySport: res.data.data, loading: false });
        } catch (error) {
            set({ error, loading: false });
        }
    },

    formData: {
        event_id: null, 
        department_id: null,
        name: "",
        sport_id: null,
        short_name: "",
        banner_image: null,
        players: [],
    },

    setFormData: (formData) => set({ formData }),
    resetFormData: () => set({
        formData: {
            event_id: null,
            department_id: null,
            name: "",
            sport_id: null,
            short_name: "",
            banner_image: null,
            players: [],
        }
    }),

    addTeam: async (e) => {
        e.preventDefault();
        set({ loading: true, error: null });
        try {
            const formData = get().formData;
            // Single POST — backend handles player-team assignments in a transaction
            const res = await axios.post(`${BASE_URL}/api/teams`, formData);
            set((state) => ({
                teams: [...state.teams, res.data.data]
            }));

            toast.success("Team added successfully");
            get().resetFormData();
            return true;
        } catch (error) {
            set({ error: error, loading: false });
            if (error.response?.data?.errors) {
                toast.error(error.response.data.errors[0]?.message || "Validation failed");
            } else {
                toast.error("Failed to add team");
            }
            return false;
        }
    },

    deleteTeam: async (id) => {
        try {
            await axios.delete(`${BASE_URL}/api/teams/${id}`);
            toast.success("Team deleted successfully");
            get().fetchTeams();
            return true;
        } catch {
            toast.error("Failed to delete team");
                return false;
        }
    }, 

}));

export const useTeamPlayersStore = create((set, get) => ({
    teamPlayers: [],
    fetchTeamPlayers: async () => {
        try {
            const res = await axios.get(`${BASE_URL}/api/player-team`);
            set({ teamPlayers: res.data.data });
        } catch (error) {
            set({ error });
        }
    },
}));