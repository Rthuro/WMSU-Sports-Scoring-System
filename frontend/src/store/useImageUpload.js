import { create } from "zustand";
import axios from "axios";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:3000" : import.meta.env.VITE_API_URL;

export const useImageUpload = create((set, get) => ({
    uploadImage: async (image) => {
        try {
            const response = await axios.post(`${BASE_URL}/api/upload`, image);
            return response.data;
        } catch (error) {
            console.error("Error uploading image:", error);
            return null;
        }
    }
}))