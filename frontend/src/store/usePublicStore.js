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

}));

