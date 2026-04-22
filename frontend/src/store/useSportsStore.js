import { create } from "zustand";
import axios from "axios";
import { toast } from "react-hot-toast";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:3000" : import.meta.env.VITE_API_URL;

export const useSportsStore = create((set, get) => ({
    sports: [],
    sport: [],
    error: null,
    setRules: [],
    scoringPoints: [],
    stats: [],
    penalties: [],

    fetchSports: async () => {
        try {
            const response = await axios.get(`${BASE_URL}/api/sports`);
            set({ sports: response.data.data });
        } catch (err) {
            if (err.status === 429)
                set({ error: "Rate limit exceeded" });
            else set({ error: "Something went wrong" });
        }
    },

    fetchSportById: async (sport_id) => {
        try {
            const response = await axios.get(`${BASE_URL}/api/sports/${sport_id}`);
            set({ sport: response.data.data });
            return response.data.data;
        } catch (err) {
            if (err.status === 429)
                set({ error: "Rate limit exceeded" });
            else set({ error: "Something went wrong" });
        }
    },


    fetchSetRules: async (sport_id) => {
        try {
            const response = await axios.get(`${BASE_URL}/api/set-rules/${sport_id}`);
            set({ setRules: response.data.data });
        } catch (err) {
            if (err.status === 429)
                set({ error: "Rate limit exceeded" });
            else set({ error: "Something went wrong" });
        }
    },

    fetchScoringPoints: async (sport_id) => {
        try {
            const response = await axios.get(`${BASE_URL}/api/scoring-points/${sport_id}`);
            set({ scoringPoints: response.data.data });
        } catch (err) {
            if (err.status === 429)
                set({ error: "Rate limit exceeded" });
            else set({ error: "Something went wrong" });
        }
    },

    fetchPenalties: async (sportId) => {
        try {
            const response = await axios.get(`${BASE_URL}/api/penalties/${sportId}`);
            set({ penalties: response.data.data });
        } catch (err) {
            if (err.status === 429)
                set({ error: "Rate limit exceeded" });
            else set({ error: "Something went wrong" });
        }
    },


    fetchStats: async (sport_id) => {
        try {
            const response = await axios.get(`${BASE_URL}/api/stats/${sport_id}`);
            set({ stats: response.data.data });
        } catch (err) {
            if (err.status === 429)
                set({ error: "Rate limit exceeded" });
            else set({ error: "Something went wrong" });
        }
    },

    fetchPositions: async (sport_id) => {
        try {
            const response = await axios.get(`${BASE_URL}/api/sport-positions/${sport_id}`);
            set({ positions: response.data.data });
        } catch (err) {
            if (err.status === 429)
                set({ error: "Rate limit exceeded" });
            else set({ error: "Something went wrong" });
        }
    },

    formData: {
        name: "",
        iconPath: "",
        scoringType: "",
        defaultSets: "",
        maxSets: "",
        maxScore: null,
        timePerSet: null,
        minPlayers: null,
        maxPlayers: null,
        useSetBasedScoring: false,
        hasPenaltyAffectsScore: false,
        hasSetLineUp: false,
        set_rules: [],
        scoring_points: [],
        penalties: [],
        stats: [],
        positions: []
    },

    setFormData: (formData) => set({ formData }),
    resetForm: () => set({
        formData: { name: "", iconPath: "", scoringType: "", defaultSets: "", maxSets: "", maxScore: null, timePerSet: null, minPlayers: null, maxPlayers: null, useSetBasedScoring: false, hasPenaltyAffectsScore: false, hasSetLineUp: false, set_rules: [], scoring_points: [], penalties: [], stats: [], positions: [] }

    }),

    fetchSportId: async (sportName) => {
        try {
            const response = await axios.get(`${BASE_URL}/api/sports/${sportName}`);
            if (response.data.success) {
                console.log("Sport ID:", response.data.data.sport_id);
                set({ formData: { ...get().formData, sport_id: response.data.data.sport_id } });
            } else {
                console.error("Sport not found");
                return null;
            }
        } catch (err) {
            if (err.status === 429)
                set({ error: "Rate limit exceeded" });
            else set({ error: "Something went wrong" });
        }
    },

    checkSportsExists: async () => {
        const { formData, setFormData } = get();
        try {
            const response = await axios.get(`${BASE_URL}/api/sports/${formData.name}`);
            console.log("Response data:", response.data.success);
            if (response.data.success) {
                toast.error(`Sport ${formData.name} already exists`);
                setFormData({ ...formData, name: "" });
                return true;
            } else {
                toast.success("Sport is available");
                return false;
            }
        } catch (err) {
            if (err.status === 429)
                set({ error: "Rate limit exceeded" });
            else set({ error: "Something went wrong" });
        }
    },

    addSport: async (e) => {
        e.preventDefault();

        try {
            const { formData } = get();
            // Single POST — backend handles all sub-resources in a transaction
            const res = await axios.post(`${BASE_URL}/api/sports`, formData);
            set((state) => ({
                sports: [...state.sports, res.data.data]
            }));

            toast.success("Sport added successfully");
            get().resetForm();
        } catch (error) {
            console.log("Error in sport function", error);
            if (error.response?.data?.errors) {
                // Show first validation error from Zod
                toast.error(error.response.data.errors[0]?.message || "Validation failed");
            } else {
                toast.error("Something went wrong");
            }
        }
    },


}));
