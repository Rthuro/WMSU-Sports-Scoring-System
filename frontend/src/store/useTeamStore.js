import { create } from "zustand";
import axios from "axios";
import { toast } from "react-hot-toast";


const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:3000" : import.meta.env.VITE_API_URL;

export const useTeamStore = create((set, get) => ({
    teams: [],
    teamsBySport: [],
    teamProfile: null,
    error: null,
    loading: false,
    profileLoading: false,

    fetchTeams: async () => {
        set({ loading: true, error: null });
        try {
            const res = await axios.get(`${BASE_URL}/api/teams`);
            set({ teams: res.data.data, loading: false });
        } catch (error) {
            set({ error, loading: false });
        }
    },

    fetchTeamProfile: async (type, id) => {
        set({ profileLoading: true, error: null, teamProfile: null });
        try {
            const res = await axios.get(`${BASE_URL}/api/teams/${type}/${id}/profile`);
            set({ teamProfile: res.data.data, profileLoading: false });
        } catch (error) {
            set({ error, profileLoading: false });
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
            set((state) => ({
                teams: state.teams.filter((t) => t.team_id !== id)
            }));
            return true;
        } catch {
            toast.error("Failed to delete team");
            return false;
        }
    },

    updateTeam: async (id, data) => {
        set({ loading: true, error: null });
        try {
            const res = await axios.put(`${BASE_URL}/api/teams/${id}`, data);
            toast.success("Team updated successfully");
            set((state) => ({
                teamProfile: state.teamProfile?.team_id === id
                    ? { ...state.teamProfile, ...res.data.data }
                    : state.teamProfile,
                teams: state.teams.map((t) => t.team_id === id ? { ...t, ...res.data.data } : t),
                loading: false
            }));
            return true;
        } catch (error) {
            set({ error, loading: false });
            toast.error("Failed to update team");
            return false;
        }
    },

}));

export const useTeamPlayersStore = create((set, get) => ({
    teamPlayers: [],
    ByTeamPlayers: [],

    fetchTeamPlayers: async () => {
        try {
            const res = await axios.get(`${BASE_URL}/api/player-team`);
            set({ teamPlayers: res.data.data });
        } catch (error) {
            set({ error });
        }
    },
    fetchByTeamPlayers: async (teamId) => {
        try {
            const res = await axios.get(`${BASE_URL}/api/player-team/by-team/${teamId}`);
            console.log(res.data.data)
            return res.data.data;
        } catch (error) {
            set({ error });
        }
    },
    addPlayerTeam: async (data) => {
        try {
            const res = await axios.post(`${BASE_URL}/api/player-team`, data);
            set((state) => ({
                teamPlayers: [...state.teamPlayers, res.data.data]
            }));
            return true;
        } catch (error) {
            set({ error });
            return false;
        }
    },
    updatePlayerTeam: async (id, data) => {
        try {
            const res = await axios.put(`${BASE_URL}/api/player-team/${id}`, data);
            set((state) => ({
                teamPlayers: state.teamPlayers.map((t) => t.player_team_id === id ? { ...t, ...res.data.data } : t)
            }));
            return true;
        } catch (error) {
            set({ error });
            return false;
        }
    },
    deletePlayerTeam: async (id) => {
        try {
            await axios.delete(`${BASE_URL}/api/player-team/${id}`);
            set((state) => ({
                teamPlayers: state.teamPlayers.filter((t) => t.player_team_id !== id)
            }));
            return true;
        } catch (error) {
            set({ error });
            return false;
        }
    },
}));