import { create } from "zustand";
import axios from "axios";
import { toast } from "react-hot-toast";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:3000" : import.meta.env.VITE_API_URL;

export const useDepartmentStore = create((set, get) => ({
    departments: [],

    fetchDepartments: async () => {
        set({ loading: true, error: null });
        try {
            const res = await axios.get(`${BASE_URL}/api/departments`);
            set({ departments: res.data.data, loading: false });
        } catch (error) {
            set({ error, loading: false });
        }
    },

    formData: {
        name: "",
        abbreviation: "",
        logo: null
    },

    setFormData: (formData) => set({ formData }),
    resetFormData: () => set({
        formData: {
            name: "",
            abbreviation: "",
            logo: null
        }
    }),

    addDepartment: async (e) => {
        e.preventDefault();
        set({ loading: true, error: null });
        try {
            const formData = get().formData;
            const res = await axios.post(`${BASE_URL}/api/departments`, formData);
            
            set((state) => ({
                departments: [...state.departments, res.data.data] 
            }));

            toast.success("Department added successfully");
            get().fetchDepartments();
            get().resetFormData();
            return true;
        } catch (error) {
            set({ error, loading: false });
            toast.error("Failed to add department");
            return false;

        }
    },

    updateDepartment: async (e, dataToUpdate) => {
        e.preventDefault();
        const id = dataToUpdate.id;
        try {
            const res = await axios.put(`${BASE_URL}/api/departments/${id}`, dataToUpdate);
            
            set((state) => ({
                departments: state.departments.map(d => d.id === id ? res.data.data : d)
            }));

            toast.success("Department updated successfully");
            return true;
        } catch (error) {
            toast.error("Failed to update department");
            return false;

        }
    },

    deleteDepartment: async (e, id) => {
        e.preventDefault();
        try {
            await axios.delete(`${BASE_URL}/api/departments/${id}`);
            set({
                departments: get().departments.filter((d) => d.id !== id),
            });
            toast.success("Department deleted successfully");
            return true;
        } catch {
            toast.error("Failed to delete department");
             return false;
        }
    },


}));
