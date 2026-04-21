import { create } from "zustand";
import axios from "axios";
import { toast } from "react-hot-toast";
const matchId = () => crypto.randomUUID?.();


const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:3000" : import.meta.env.VITE_API_URL;


export const useMatchStore = create((set, get) => ({
    matches: [],
    matchPoints: [],
    matchParticipants: [],
    matchBySport: [],

    fetchMatches: async () => {
        try {
            const res = await axios.get(`${BASE_URL}/api/match`);
            set({ matches: res.data.data });
        } catch (error) {
            set({ error });
        }
    },

    fetchMatchBySports: async (sportId) => {
        try {
            const res = await axios.get(`${BASE_URL}/api/match/sport/${sportId}`);
            set({ matchBySport: res.data.data });
        } catch (error) {
            set({ error });
        }
    },

    fetchMatchPoints: async () => {
        try {
            const res = await axios.get(`${BASE_URL}/api/match-points`);
            set({ matchPoints: res.data.data });
        } catch (error) {
            set({ error });
        }
    },

    fetchMatchParticipants: async () => {
        try {
            const res = await axios.get(`${BASE_URL}/api/match-participants`);
            set({ matchParticipants: res.data.data });
        } catch (error) {
            set({ error });
        }
    },

    formData: {
        match_id: "",
        sport_id: null,
        match_name: "",
        date: null,
        start_time: null,
        end_time: null,
        location: "",
        is_team: true,
        team_a_id: null,
        team_b_id: null,
        player_a_id: null,
        player_b_id: null
    },

    setFormData: (formData) => set({ formData }),
    resetFormData: () => set({
        formData: {
            match_id: "",
            sport_id: null,
            match_name: "",
            date: null,
            start_time: null,
            end_time: null,
            location: "",
            is_team: true,
            team_a_id: null,
            team_b_id: null,
            player_a_id: null,
            player_b_id: null
        }
    }),

    addMatch: async (e) => {
        e.preventDefault();
        try {
            const formData = get().formData;
            const id = matchId();
            formData.match_id = id;

            // Single POST — backend handles participant creation in a transaction
            const res = await axios.post(`${BASE_URL}/api/match`, formData);
            set((state) => ({
                matches: [...state.matches, res.data.data]
            }));

            toast.success("Match added successfully");
            get().resetFormData();
            return res.data.data;
        } catch (error) {
            set({ error, loading: false });
            if (error.response?.data?.errors) {
                toast.error(error.response.data.errors[0]?.message || "Validation failed");
            } else {
                toast.error("Failed to add match");
            }
        }
    },
}));

export const useMatchPointsStore = create((set, get) => ({
    allMatchPoints: [],
    matchPoints: [],
    matchPointsFormData: {
        match_id: "",
        team_id: null,
        player_id: null,
        set_number: 1,
        value: 0,
        time: null
    },
    fetchAllMatchPoints: async () => {
        try {
            const res = await axios.get(`${BASE_URL}/api/match-points`);
            set({ allMatchPoints: res.data.data });
        } catch (error) {
            set({ error });
        }
    },

    fetchMatchPoints: async (match_id) => {
        try {
            const res = await axios.get(`${BASE_URL}/api/match-points/match/${match_id}`);
            set({ matchPoints: res.data.data });
        } catch (error) {
            set({ error });
        }
    },
    addMatchPoint: async (matchPoint) => {
        try {
            const res = await axios.post(`${BASE_URL}/api/match-points`, matchPoint);
            set((state) => ({
                allMatchPoints: [...state.allMatchPoints, res.data.data]
            }));

            if (get().matchPoints[0]?.match_id === matchPoint.match_id) {
                set((state) => ({
                    matchPoints: [...state.matchPoints, res.data.data]
                }));
            }
            toast.success("Match point added successfully");
        } catch (error) {
            set({ error });
            toast.error("Failed to add match point");
        }
    },
    updateMatchPoint: async (matchPoint) => {
        try {
            const res = await axios.put(`${BASE_URL}/api/match-points`, matchPoint);
            set((state) => ({
                allMatchPoints: [
                    ...state.allMatchPoints.filter(mp => mp.entry_id !== matchPoint.entry_id),
                    res.data.data,
                ]
            }));

            if (get().matchPoints[0]?.match_id === matchPoint.match_id) {
                set((state) => ({
                    matchPoints: [...state.allMatchPoints.filter(mp => mp.entry_id !== matchPoint.entry_id),
                    res.data.data,]
                }));
            }
            toast.success("Match point updated successfully");
        } catch (error) {
            set({ error });
            toast.error("Failed to update match point");
        }
    },
    resetMatchPoints: () => set({
        matchPointsFormData: {
            match_id: "",
            team_id: null,
            player_id: null,
            set_number: 1,
            value: 0,
            time: null
        }
    }),
}));