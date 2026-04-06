import { create } from "zustand";
import axios from "axios";
import { toast } from "react-hot-toast";
const generateId = () => crypto.randomUUID?.();
const tournamentId = () => crypto.randomUUID?.();

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:3000" : "";

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
            const res = await axios.post(`${BASE_URL}/api/tournaments`, {
                tournament_id: tournamentID,
                ...formData
            });

            set((state) => ({
                tournaments: [...state.tournaments, res.data.data]
            }));


            // Generate teams for the tournament
            await Promise.all(
                formData.teams?.map((team) =>
                    axios.post(`${BASE_URL}/api/tournament-teams`, {
                        tournament_id: tournamentID,
                        team_id: team
                    })
                )
            );

            // Generate tally for the tournament
            await Promise.all(
                formData.teams?.map((team) =>
                    axios.post(`${BASE_URL}/api/tournament-tally`, {
                        tournament_id: tournamentID,
                        team_id: team
                    })
                )
            );

            // Generate matches for the tournament
            const teams = formData.teams;
            const type = formData.bracketing;
            const matchPromises = [];
            const allTeams = await axios.get(`${BASE_URL}/api/teams`);
            const allTeamsData = allTeams.data.data;

            if (type === "round-robin") {
                let matchCount = 1;
                for (let i = 0; i < teams.length; i++) {
                    for (let j = i + 1; j < teams.length; j++) {
                        const team1 = teams[i];
                        const team2 = teams[j];

                        const team1Name = allTeamsData.find(team => team.team_id === team1)?.name || "Team 1";
                        const team2Name = allTeamsData.find(team => team.team_id === team2)?.name || "Team 2";

                        const match_name = `${team1Name} vs ${team2Name}`;

                        matchPromises.push(
                            axios.post(`${BASE_URL}/api/tournament-matches`, {
                                match_id: generateId(),
                                sport_id: teams.sport_id,
                                tournament_id: tournamentID,
                                match_name: match_name,
                                date: null,
                                start_time: null,
                                end_time: null,
                                location: "",
                                team_a_id: team1,
                                team_b_id: team2 || null,
                                round: 1
                            })
                        );
                        matchCount+1;
                    }
                }
            } else if (type === "single-elimination") {
                const shuffledTeams = [...teams].sort(() => Math.random() - 0.5); // optional: randomize
                const totalTeams = shuffledTeams.length;

                for (let i = 0; i < totalTeams; i += 2) {
                    const team1 = shuffledTeams[i];
                    const team2 = shuffledTeams[i + 1];
                    const team1Name = allTeamsData.find(team => team.team_id === team1)?.name || "Team 1";
                    const team2Name = allTeamsData.find(team => team.team_id === team2)?.name || "Team 2";

                    let match_name;

                    if (team2) {
                        match_name = `${team1Name} vs ${team2Name}`;
                    } else {
                        match_name = `${team1Name} vs Pending`; 
                    }

                    matchPromises.push(
                        axios.post(`${BASE_URL}/api/tournament-matches`, {
                            match_id: generateId(),
                            sport_id: teams.sport_id,
                            tournament_id: tournamentID,
                            match_name: match_name,
                            date: null,
                            start_time: null,
                            end_time: null,
                            location: "",
                            team_a_id: team1,
                            team_b_id: team2 || null,
                            round: 1,
                        })
                    );
                }
            }

            await Promise.all(matchPromises);
            toast.success("Tournament created successfully");
            get().resetFormData();
            return true;
        } catch (error) {
            set({ error });
            toast.error("Failed to create tournament");
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