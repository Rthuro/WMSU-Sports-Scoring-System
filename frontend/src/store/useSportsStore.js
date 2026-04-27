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


    fetchStats: async () => {
        try {
            const response = await axios.get(`${BASE_URL}/api/stats/`);
            set({ stats: response.data.data });
        } catch (err) {
            if (err.status === 429)
                set({ error: "Rate limit exceeded" });
            else set({ error: "Something went wrong" });
        }
    },

    sportStats: [],

    fetchStatsBySportId: async (sport_id) => {
        try {
            const response = await axios.get(`${BASE_URL}/api/stats/sport/${sport_id}`);
            set({ sportStats: response.data.data });
        } catch (err) {
            if (err.status === 429)
                set({ error: "Rate limit exceeded" });
            else set({ error: "Something went wrong" });
        }
    },

    addStat: async (statData) => {
        try {
            const response = await axios.post(`${BASE_URL}/api/stats`, statData);
            set((state) => ({ stats: [...state.stats, response.data.data] }));
            toast.success("Stat added successfully");
            return true;
        } catch (err) {
            console.log("Error in sport function", err);
            if (err.response?.data?.errors) {
                // Show first validation error from Zod
                toast.error(err.response.data.errors[0]?.message || "Validation failed");
            } else {
                toast.error("Something went wrong");
            }
            return false;
        }
    },

    updateStat: async (statData) => {
        try {
            const response = await axios.put(`${BASE_URL}/api/stats/${statData.stats_id}`, statData);
            set((state) => ({ stats: state.stats.map((stat) => stat.stats_id === statData.stats_id ? response.data.data : stat) }));
            set((state) => ({ sportStats: state.sportStats.map((stat) => stat.stats_id === statData.stats_id ? response.data.data : stat) }));
            toast.success("Stat updated successfully");
        } catch (err) {
            console.log("Error in sport function", err);
            if (err.response?.data?.errors) {
                // Show first validation error from Zod
                toast.error(err.response.data.errors[0]?.message || "Validation failed");
            } else {
                toast.error("Something went wrong");
            }
        }
    },

    addPenalties: async (penaltyData) => {
        try {
            const response = await axios.post(`${BASE_URL}/api/penalties`, penaltyData);
            set((state) => ({ penalties: [...state.penalties, response.data.data] }));
            toast.success("Penalty added successfully");
            return true;
        } catch (err) {
            console.log("Error in sport function", err);
            if (err.response?.data?.errors) {
                // Show first validation error from Zod
                toast.error(err.response.data.errors[0]?.message || "Validation failed");
            } else {
                toast.error("Something went wrong");
            }
            return false;
        }
    },

    updatePenalties: async (penaltyData) => {
        try {
            const response = await axios.put(`${BASE_URL}/api/penalties/${penaltyData.penalty_id}`, penaltyData);
            set((state) => ({ penalties: state.penalties.map((penalty) => penalty.penalty_id === penaltyData.penalty_id ? response.data.data : penalty) }));
            toast.success("Penalty updated successfully");
        } catch (err) {
            console.log("Error in sport function", err);
            if (err.response?.data?.errors) {
                // Show first validation error from Zod
                toast.error(err.response.data.errors[0]?.message || "Validation failed");
            } else {
                toast.error("Something went wrong");
            }
        }
    },

    deleteStat: async (stat_id) => {
        try {
            await axios.delete(`${BASE_URL}/api/stats/${stat_id}`);
            set((state) => ({ stats: state.stats.filter((stat) => stat.stat_id !== stat_id) }));
            toast.success("Stat deleted successfully");
            return true;
        } catch (err) {
            console.log("Error in sport function", err);
            if (err.response?.data?.errors) {
                // Show first validation error from Zod
                toast.error(err.response.data.errors[0]?.message || "Validation failed");
            } else {
                toast.error("Something went wrong");
            }
            return false;
        }
    },

    deletePenalties: async (penalty_id) => {
        try {
            await axios.delete(`${BASE_URL}/api/penalties/${penalty_id}`);
            set((state) => ({ penalties: state.penalties.filter((penalty) => penalty.penalty_id !== penalty_id) }));
            toast.success("Penalty deleted successfully");
            return true;
        } catch (err) {
            console.log("Error in sport function", err);
            if (err.response?.data?.errors) {
                // Show first validation error from Zod
                toast.error(err.response.data.errors[0]?.message || "Validation failed");
            } else {
                toast.error("Something went wrong");
            }
            return false;
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
        if (e) e.preventDefault();

        try {
            const { formData } = get();
            // Single POST — backend handles all sub-resources in a transaction
            const res = await axios.post(`${BASE_URL}/api/sports`, formData);
            set((state) => ({
                sports: [...state.sports, res.data.data]
            }));

            toast.success("Sport added successfully");
            get().resetForm();
            return true;
        } catch (error) {
            console.log("Error in sport function", error);
            if (error.response?.data?.errors) {
                // Show first validation error from Zod
                toast.error(error.response.data.errors[0]?.message || "Validation failed");
            } else {
                toast.error("Something went wrong");
            }
            return false;
        }
    },

    updateSportDetails: async (sportId, formData) => {
        try {
            const res = await axios.put(`${BASE_URL}/api/sports/${sportId}`, formData);
            set((state) => ({
                sports: state.sports.map((s) => s.sport_id === sportId ? res.data.data : s),
                sport: res.data.data
            }));
            toast.success("Sport updated successfully");
            return true;
        } catch (error) {
            console.log("Error updating sport", error);
            if (error.response?.data?.errors) {
                toast.error(error.response.data.errors[0]?.message || "Validation failed");
            } else {
                toast.error("Something went wrong");
            }
            return false;
        }
    },

    deleteSport: async (id) => {
        try {
            await axios.delete(`${BASE_URL}/api/sports/${id}`);
            set((state) => ({
                sports: state.sports.filter((s) => s.sport_id !== id)
            }));
            toast.success("Sport deleted successfully");
            return true;
        } catch (error) {
            console.log("Error deleting sport", error);
            if (error.response?.data?.errors) {
                toast.error(error.response.data.errors[0]?.message || "Validation failed");
            } else {
                toast.error("Something went wrong");
            }
            return false;
        }
    }

}));
