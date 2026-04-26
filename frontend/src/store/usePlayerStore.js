import { create } from "zustand";
import axios from "axios";
import { toast } from "react-hot-toast";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:3000" : import.meta.env.VITE_API_URL;

export const usePlayerStore = create((set, get) => ({
    players: [],
    playerProfile: null,
    loading: false,
    error: null,
    profileLoading: false,

    formData: {
        sport_id: "",
        first_name: "",
        last_name: "",
        middle_initial: "",
        gender: "",
        student_id: "",
        photo: ""
    },

    setFormData: (formData) => set({ formData }),
    resetFormData: () => set({
        formData: {
            first_name: "",
            last_name: "",
            middle_initial: "",
            gender: "",
            student_id: "",
            photo: ""
        }
    }),

    fetchPlayers: async () => {
        set({ loading: true, error: null });
        try {
            const res = await axios.get(`${BASE_URL}/api/players`);
            set({ players: res.data.data, loading: false });
        } catch (error) {
            set({ error, loading: false });
        }
    },

    fetchPlayerProfile: async (id) => {
        set({ profileLoading: true, error: null, playerProfile: null });
        try {
            const res = await axios.get(`${BASE_URL}/api/players/profile/${id}`);
            set({ playerProfile: res.data.data, profileLoading: false });
        } catch (error) {
            set({ error, profileLoading: false });
        }
    },

    fetchPlayerById: async (id) => {
        set({ loading: true, error: null });
        try {
            const res = await axios.get(`${BASE_URL}/api/players/${id}`);
            set({ players: res.data.data, loading: false });
        } catch (error) {
            set({ error, loading: false });
        }
    },

    fetchPlayersBySport: async (sportId) => {
        set({ loading: true, error: null });
        try {
            const res = await axios.get(`${BASE_URL}/api/players/sport/${sportId}`);
            set({ players: res.data.data, loading: false });
        } catch (error) {
            set({ error, loading: false });
        }
    },

    addPlayer: async (e) => {
        e.preventDefault();
        set({ loading: true, error: null });
        try {
            const playerData = get().formData;
            const res = await axios.post(`${BASE_URL}/api/players`, playerData);

            set((state) => ({
                players: [...state.players, res.data.data]
            }));

            toast.success("Player added successfully");
            get().resetFormData();
            return true;
        } catch (error) {
            toast.error("Something went wrong");
            set({ error, loading: false });
            return false;
        }
    },

    editPlayer: async (id, data) => {
        set({ loading: true, error: null });
        try {
            const res = await axios.put(`${BASE_URL}/api/players/${id}`, data);
            toast.success("Player updated successfully");
            set((state) => ({
                playerProfile: state.playerProfile?.player_id === id
                    ? { ...state.playerProfile, ...res.data.data }
                    : state.playerProfile,
                players: state.players.map((p) => p.player_id === id ? { ...p, ...res.data.data } : p),
                loading: false
            }));
            return true;
        } catch (error) {
            toast.error("Failed to update player");
            set({ error, loading: false });
            return false;
        }
    },

    removePlayer: async (id) => {
        set({ loading: true, error: null });
        try {
            await axios.delete(`${BASE_URL}/api/players/${id}`);
            set((state) => ({
                players: state.players.filter((p) => p.player_id !== id),
                playerProfile: null,
                loading: false
            }));
            toast.success("Player deleted successfully");
            return true;
        } catch (error) {
            toast.error("Failed to delete player");
            set({ error, loading: false });
            return false;
        }
    },

    checkPlayerExists: async (firstName, lastName) => {
        set({ loading: true, error: null });
        try {
            const res = await axios.get(`${BASE_URL}/api/players/${firstName}/${lastName}`);
            set({ loading: false });
            return res.data.success;
        } catch (error) {
            set({ error, loading: false });
            return false;
        }
    }
}));

export const usePlayerStatsStore = create((set, get) => ({
    playerStats: [],
    playerStatsByMatch: [],
    playerStatsByMatchAndPlayer: [],
    playerStatsByPlayer: [],

    fetchPlayerStats: async () => {
        try {
            const res = await axios.get(`${BASE_URL}/api/player-stats`);
            set({ playerStats: res.data.data });
        } catch (error) {
            set({ error, loading: false });
        }
    },

    fetchPlayerStatsByMatch: async (match_id) => {
        try {
            const res = await axios.get(`${BASE_URL}/api/player-stats/match/${match_id}`);
            set({ playerStatsByMatch: res.data.data });
        } catch (error) {
            set({ error, loading: false });
        }
    },

    fetchPlayerStatsByPlayer: async (player_id) => {
        try {
            const res = await axios.get(`${BASE_URL}/api/player-stats/player/${player_id}`);
            set({ playerStatsByPlayer: res.data.data });
            return res.data.data;
        } catch (error) {
            set({ error, loading: false });
        }
    },

    fetchMultiplePlayerStats: async (player_ids) => {
        try {
            const res = await axios.get(`${BASE_URL}/api/player-stats/multiple/${player_ids}`);
            return res.data.data;
        } catch (error) {
            set({ error, loading: false });
        }
    },

    fetchPlayerStatsByMatchAndPlayer: async (match_id, player_id) => {
        try {
            const res = await axios.get(`${BASE_URL}/api/player-stats/match/${match_id}/player/${player_id}`);
            set({ playerStatsByMatchAndPlayer: res.data.data });
            return res.data.data;
        } catch (error) {
            set({ error, loading: false });
        }
    },

    addPlayerStats: async (data) => {
        try {
            const res = await axios.post(`${BASE_URL}/api/player-stats`, data);
            set((state) => ({
                playerStatsByMatchAndPlayer: [...state.playerStatsByMatchAndPlayer, res.data.data]
            }));
            toast.success("Player stats added successfully");
            return true;
        } catch (error) {
            toast.error("Failed to add player stats");
            set({ error, loading: false });
            return false;
        }
    },

    updatePlayerStats: async (entry_id, data) => {
        set({ loading: true, error: null });
        try {
            const res = await axios.put(`${BASE_URL}/api/player-stats/${entry_id}`, data);
            toast.success("Player stats updated successfully");
            set((state) => ({
                playerStatsByMatchAndPlayer: state.playerStatsByMatchAndPlayer.map((p) => p.entry_id === entry_id ? { ...p, ...res.data.data } : p),
                loading: false
            }));
            return true;
        } catch (error) {
            toast.error("Failed to update player stats");
            set({ error, loading: false });
            return false;
        }
    },

    deletePlayerStats: async (entry_id) => {
        set({ loading: true, error: null });
        try {
            await axios.delete(`${BASE_URL}/api/player-stats/${entry_id}`);
            set((state) => ({
                playerStatsByMatchAndPlayer: state.playerStatsByMatchAndPlayer.filter((p) => p.entry_id !== entry_id),
                loading: false
            }));
            toast.success("Player stats deleted successfully");
            return true;
        } catch (error) {
            toast.error("Failed to delete player stats");
            set({ error, loading: false });
            return false;
        }
    }
}));

export const usePlayerPenaltyStore = create((set, get) => ({
    playerPenalties: [],
    playerPenaltiesByMatch: [],
    playerPenaltiesByMatchAndPlayer: [],
    playerPenaltiesByPlayer: [],

    fetchPlayerPenalties: async () => {
        try {
            const res = await axios.get(`${BASE_URL}/api/player-penalties`);
            set({ playerPenalties: res.data.data });
        } catch (error) {
            set({ error, loading: false });
        }
    },

    fetchPlayerPenaltiesByMatch: async (match_id) => {
        try {
            const res = await axios.get(`${BASE_URL}/api/player-penalties/match/${match_id}`);
            set({ playerPenaltiesByMatch: res.data.data });
        } catch (error) {
            set({ error, loading: false });
        }
    },

    fetchPlayerPenaltiesByPlayer: async (player_id) => {
        try {
            const res = await axios.get(`${BASE_URL}/api/player-penalties/player/${player_id}`);
            set({ playerPenaltiesByPlayer: res.data.data });
            return res.data.data;
        } catch (error) {
            set({ error, loading: false });
        }
    },

    fetchPlayerPenaltiesByMatchAndPlayer: async (match_id, player_id) => {
        try {
            const res = await axios.get(`${BASE_URL}/api/player-penalties/match/${match_id}/player/${player_id}`);
            set({ playerPenaltiesByMatchAndPlayer: res.data.data });
            return res.data.data;
        } catch (error) {
            set({ error, loading: false });
        }
    },

    addPlayerPenalties: async (data) => {
        try {
            const res = await axios.post(`${BASE_URL}/api/player-penalties`, data);
            set((state) => ({
                playerPenaltiesByMatchAndPlayer: [...state.playerPenaltiesByMatchAndPlayer, res.data.data]
            }));
            toast.success("Player penalties added successfully");
            return true;
        } catch (error) {
            toast.error("Failed to add player penalties");
            set({ error, loading: false });
            return false;
        }
    },

    updatePlayerPenalties: async (entry_id, data) => {
        set({ loading: true, error: null });
        try {
            const res = await axios.put(`${BASE_URL}/api/player-penalties/${entry_id}`, data);
            toast.success("Player penalties updated successfully");
            set((state) => ({
                playerPenaltiesByMatchAndPlayer: state.playerPenaltiesByMatchAndPlayer.map((p) => p.entry_id === entry_id ? { ...p, ...res.data.data } : p),
                loading: false
            }));
            return true;
        } catch (error) {
            toast.error("Failed to update player penalties");
            set({ error, loading: false });
            return false;
        }
    },

    deletePlayerPenalties: async (entry_id) => {
        set({ loading: true, error: null });
        try {
            await axios.delete(`${BASE_URL}/api/player-penalties/${entry_id}`);
            set((state) => ({
                playerPenaltiesByMatchAndPlayer: state.playerPenaltiesByMatchAndPlayer.filter((p) => p.entry_id !== entry_id),
                loading: false
            }));
            toast.success("Player penalties deleted successfully");
            return true;
        } catch (error) {
            toast.error("Failed to delete player penalties");
            set({ error, loading: false });
            return false;
        }
    }
}));