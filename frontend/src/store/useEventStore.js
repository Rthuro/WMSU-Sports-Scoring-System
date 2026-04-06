import { create } from "zustand";
import axios from "axios";
import { toast } from "react-hot-toast";
const generateId = () => crypto.randomUUID?.() || Date.now().toString();

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:3000" : import.meta.env.VITE_API_URL;


export const useEventStore = create((set, get) => ({
    events: [],
    event: null,
    eventTally: [],

    fetchEvents: async () => {
        set({ loading: true, error: null });
        try {
            const res = await axios.get(`${BASE_URL}/api/events`);
            set({ events: res.data.data, loading: false });
        } catch (error) {
            set({ error, loading: false });
        }
    },

    formData: {
        name: "",
        description: "",
        start_date: null,
        end_date: null,
        location: "",
        banner_image: null,
    },

    setFormData: (formData) => set({ formData }),
    resetFormData: () => set({
        formData: {
            name: "",
            description: "",
            start_date: null,
            end_date: null,
            location: "",
            banner_image: null,
        }
    }),

    addEvent : async (e) => {
        e.preventDefault();
        set({ loading: true, error: null });
        try {
            const formData = get().formData;
            const eventData = 
            {
                event_id: generateId(),
                ...formData
            }
            const res = await axios.post(`${BASE_URL}/api/events`, eventData);
            set((state) => ({
                events: [...state.events, res.data.data]
            }));

            toast.success("Event added successfully");
            get().fetchEvents();
            get().resetFormData();
            return res.data.data.event_id;
        } catch (error) {
            set({ error, loading: false });
            toast.error("Failed to add event");
        }
    },

    getEventById: async (id) => {
        try {
            const res = await axios.get(`${BASE_URL}/api/events/${id}`);

            set({ event: res.data.data });
        } catch {
            toast.error("Failed to fetch event details");
        }
    },

}));