import { create } from "zustand";
import axios from "axios";
import { toast } from "react-hot-toast";
const matchId = () => crypto.randomUUID?.();
import { useSportsStore } from "./useSportsStore";


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

            // Fetch sport details to get default_sets
            await useSportsStore.getState().fetchSportById(formData.sport_id);
            const sport = useSportsStore.getState().sport;
            const def_set = sport?.default_sets || 1;

            const res = await axios.post(`${BASE_URL}/api/match`, formData);
            const createdMatch = res.data.data;

            // Initialize match points for each set
            const initial_match_point = async () => {
                for (let i = 1; i <= def_set; i++) {
                    await axios.post(`${BASE_URL}/api/match-points`, {
                        match_id: createdMatch.match_id,
                        team_a_id: createdMatch.team_a_id,
                        team_b_id: createdMatch.team_b_id,
                        player_a_id: createdMatch.player_a_id,
                        player_b_id: createdMatch.player_b_id,
                        set_number: i,
                        a_score: 0,
                        b_score: 0,
                    });
                }
            }

            await initial_match_point();

            set((state) => ({
                matches: [...state.matches, createdMatch]
            }));

            toast.success("Match added successfully");
            get().resetFormData();
            return res.data.data;
        } catch (error) {
            set({ error, loading: false });
            if (error.response?.data?.errors) {
                toast.error(error.response.data.errors[0]?.message || "Validation failed");
            } else {
                toast.error(error.response?.data?.message || "Failed to add match");
            }
            return null;
        }
    },

    updateMatch: async (matchId, data) => {
        try {
            const res = await axios.put(`${BASE_URL}/api/match/${matchId}`, data);
            set((state) => ({
                matches: state.matches.map((m) =>
                    m.match_id === matchId ? { ...m, ...res.data.data } : m
                )
            }));
            toast.success("Match updated successfully");
            return res.data.data;
        } catch (error) {
            if (error.response?.data?.errors) {
                toast.error(error.response.data.errors[0]?.message || "Validation failed");
            } else {
                toast.error(error.response?.data?.message || "Failed to update match");
            }
            return null;
        }
    },

    deleteMatch: async (matchId) => {
        try {
            const res = await axios.delete(`${BASE_URL}/api/match/permanent/${matchId}`);
            set((state) => ({
                matches: state.matches.filter((m) => m.match_id !== matchId)
            }));
            toast.success("Match deleted successfully");
            return res.data.data;
        } catch (error) {
            if (error.response?.data?.errors) {
                toast.error(error.response.data.errors[0]?.message || "Validation failed");
            } else {
                toast.error(error.response?.data?.message || "Failed to delete match");
            }
            return null;
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
                    matchPoints: [...state.matchPoints.filter(mp => mp.entry_id !== matchPoint.entry_id),
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