import { create } from "zustand";
import axios from "axios";
import { toast } from "react-hot-toast";
const generateId = () => crypto.randomUUID?.();
const tournamentId = () => crypto.randomUUID?.();

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:3000" : import.meta.env.VITE_API_URL;

export const useTournamentStore = create((set, get) => ({ 
    tournaments: [],
    tournament: [],
    eventTournaments: [],
    sportTournaments: [],

    fetchTournaments: async () => {
        try {
            const res = await axios.get(`${BASE_URL}/api/tournaments`);
            set({ tournaments: res.data.data });
        } catch (error) {
            set({ error });
        }
    },

    fetchTournamentById: async (id) => {
        try {
            const res = await axios.get(`${BASE_URL}/api/tournaments/${id}`);
            set({ tournament: res.data.data });
        } catch (error) {
            set({ error });
        }
    },

    fetchTournamentsByEvent: async (event_id) => {
        try {
            const res = await axios.get(`${BASE_URL}/api/tournaments/${event_id}`);
            console.log("Event Tournaments: ", res.data.data[0]);
            set({ eventTournaments: res.data.data });
        } catch (error) {
            set({ error });
        }
    },

    fetchTournamentsBySport: async (sport_id) => {
        try {
            const res = await axios.get(`${BASE_URL}/api/tournaments/${sport_id}`);
            set({ sportTournaments: res.data.data });
        } catch (error) {
            set({ error });
        }
    },

     formData: {
        event_id: "",
        sport_id: null,
        name: "",
        description: "",
        start_date: null,
        end_date: null,
        location: "",
        banner_image: null,
        bracketing: "single-elimination", // default value
        teams: []
    },

    setFormData: (formData) => set({ formData }),
    resetFormData: () => set({
        formData: {
            event_id: "",
            sport_id: null,
            name: "",
            description: "",
            start_date: null,
            end_date: null,
            location: "",
            banner_image: null,
            bracketing: "single-elimination",
            teams: []
        }
    }),

    createTournament: async (e) => {
        e.preventDefault();
        const formData = get().formData;
        const tournamentID = tournamentId();

        try {
            // Single POST — backend generates teams, tally, and bracket matches in a transaction
            const res = await axios.post(`${BASE_URL}/api/tournaments`, {
                tournament_id: tournamentID,
                ...formData
            });

            set((state) => ({
                tournaments: [...state.tournaments, res.data.data]
            }));

            toast.success("Tournament created successfully");
            get().resetFormData();
            return true;
        } catch (error) {
            set({ error });
            if (error.response?.data?.errors) {
                toast.error(error.response.data.errors[0]?.message || "Validation failed");
            } else {
                toast.error("Failed to create tournament");
            }
            return false;
        }
    },

}));

export const useTournamentTeamStore = create((set, get) => ({ 
    tournamentTeams: [],

    fetchTournamentTeams: async (tournament_id) => {
        try {
            const res = await axios.get(`${BASE_URL}/api/tournament-teams/${tournament_id}`);
            set({tournamentTeams: res.data.data});
        } catch (error) {
            set({ error });
        }   
    }
}));

export const useTournamentMatchStore = create((set, get) => ({ 
    tournamentMatch: [],
    match:[],
    resetMatch: () => set({ match: [] }),

    fetchTournamentMatch: async (tournament_id) => {
        try {
            const res = await axios.get(`${BASE_URL}/api/tournament-matches/${tournament_id}`);
            set({tournamentMatch: res.data.data});
        } catch (error) {
            set({ error });
        }   
    },

    fetchMatch: async (match_id) => {
        try {
            const res = await axios.get(`${BASE_URL}/api/tournament-matches/match/${match_id}`);
            set({match: res.data.data});
        } catch (error) {
            set({ error });
        }  
    }, 

    updateTournamentMatch: async (id, data) => {
        try {
            const res = await axios.put(`${BASE_URL}/api/tournament-matches/${id}`, data);
            return true;
        } catch (error) {
            set({ error });
            toast.error("Failed to update match");
            return false;
        }
    },
}));

export const useTournamentTallyStore = create((set, get) => ({ 
    tally: [],

    fetchTournamentTally: async () => {
        try {
            const res = await axios.get(`${BASE_URL}/api/tournament-tally`);
            set({tally: res.data.data});
        } catch (error) {
            set({ error });
        }   
    },
    updateTournamentTally: async (tournament_id, team_id, data) => {
        try {
            await axios.put(`${BASE_URL}/api/tournament-tally/${tournament_id}/${team_id}`, data);
            return true;
        } catch (error) {
            set({ error });
            toast.error("Failed to update tally");
            return false;
        }
    }
}));