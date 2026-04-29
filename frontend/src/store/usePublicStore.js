import { create } from "zustand";
import axios from "axios";
import { toast } from "react-hot-toast";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:3000" : import.meta.env.VITE_API_URL;

export const usePublicStore = create((set, get) => ({
    articles: [],
    article: [],
    error: null,

    fetchArticles: async () => {
        try {
            const response = await axios.get(`${BASE_URL}/api/articles`);
            set({ articles: response.data.data });
        } catch (err) {
            if (err.status === 429)
                set({ error: "Rate limit exceeded" });
            else set({ error: "Something went wrong" });
        }
    },

    fetchArticleById: async (article_id) => {
        try {
            const response = await axios.get(`${BASE_URL}/api/articles/${article_id}`);
            set({ article: response.data.data });
            return response.data.data;
        } catch (err) {
            if (err.status === 429)
                set({ error: "Rate limit exceeded" });
            else set({ error: "Something went wrong" });
        }
    },

    addArticle: async (articleData) => {
        try {
            const response = await axios.post(`${BASE_URL}/api/articles`, articleData);
            set((state) => ({ articles: [...state.articles, response.data.data] }));
            toast.success("Article added successfully");
            get().fetchArticles();
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

    updateArticle: async (articleData) => {
        try {
            const response = await axios.put(`${BASE_URL}/api/articles/${articleData.article_id}`, articleData);
            set((state) => ({ articles: state.articles.map((article) => article.article_id === articleData.article_id ? response.data.data : article) }));
            toast.success("Article updated successfully");
            get().fetchArticles();
            return true;
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

    deleteArticle: async (article_id) => {
        try {
            const response = await axios.delete(`${BASE_URL}/api/articles/${article_id}`);
            set((state) => ({ articles: state.articles.filter((article) => article.article_id !== article_id) }));
            toast.success("Article deleted successfully");
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

    matchesByDate: [],
    tournamentsByDate: [],
    loading: false,
    error: null,

    fetchMatchesByDateRange: async (startDate, endDate) => {
        set({ loading: true, error: null });
        try {
            const res = await axios.get(`${BASE_URL}/api/public/date/${startDate}/${endDate}`);
            const data = res.data.data;
            set({ 
                matchesByDate: data.matches || [], 
                tournamentsByDate: data.tournaments || [],
                loading: false 
            });
        } catch (error) {
            set({ error, loading: false });
        }
    },

    allMatches: [],
    allTournaments: [],
    fetchAllMatches: async () => {
        set({ loading: true, error: null });
        try {
            const response = await axios.get(`${BASE_URL}/api/public/all`);
            const data = response.data.data;
            set({ 
                allMatches: data.matches || [], 
                allTournaments: data.tournaments || [],
                loading: false 
            });
        } catch (err) {
            if (err.status === 429)
                set({ error: "Rate limit exceeded" });
            else set({ error: "Something went wrong" });
        }
    },

    publicEvents: [],
    fetchPublicEvents: async () => {
        set({ loading: true, error: null });
        try {
            const response = await axios.get(`${BASE_URL}/api/public/events`);
            set({ publicEvents: response.data.data || [], loading: false });
        } catch (err) {
            set({ error: "Something went wrong", loading: false });
        }
    },

    publicTournaments: [],
    publicTally: [],
    fetchPublicTournaments: async () => {
        set({ loading: true, error: null });
        try {
            const response = await axios.get(`${BASE_URL}/api/public/tournaments`);
            const data = response.data.data;
            set({ 
                publicTournaments: data.tournaments || [], 
                publicTally: data.tally || [],
                loading: false 
            });
        } catch (err) {
            set({ error: "Something went wrong", loading: false });
        }
    },

}));
