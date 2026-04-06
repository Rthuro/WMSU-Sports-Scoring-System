import { create } from "zustand";
import { persist } from "zustand/middleware";

// Generate unique ID
const generateId = () => crypto.randomUUID?.() || Date.now().toString();

const generateBracketMatches = (teams, sportName, tournamentId) => {
  const matches = [];
  const shuffled = [...teams].sort(() => Math.random() - 0.5); // shuffle

  for (let i = 0; i < shuffled.length; i += 2) {
    const teamA = shuffled[i];
    const teamB = shuffled[i + 1] || "BYE"; // if odd number of teams

    matches.push({
      matchId: generateId(),
      tournamentId: tournamentId,
      matchName: `${teamA} vs ${teamB}`,
      teamA,
      teamB,
      sportName,
      teamAPlayers: [],
      teamBPlayers: [],
      status: "upcoming",
      dateCreated: new Date().toLocaleString("en-PH", {
          dateStyle: "medium",
          timeStyle: "short",
        })
    });
  }

  return matches;
};

const useTournamentStore = create(
  persist(
    (set, get) => ({
      tournaments: [],

      createTournament: ({ name, sportName, teams,tournamentId }) => {
        const bracket = generateBracketMatches(teams, sportName, tournamentId);
        const newTournament = {
          tournamentId,
          name,
          sportName,
          teams,
          bracket,
          dateCreated: new Date().toLocaleString("en-PH", {
            dateStyle: "medium",
            timeStyle: "short",
            })
        };

        set((state) => ({
          tournaments: [...state.tournaments, newTournament],
        }));
      },

      updateMatchInTournament: (tournamentId, matchId, matchData) => {
        set((state) => ({
          tournaments: state.tournaments.map((tournament) => {
            if (tournament.tournamentId !== tournamentId) return tournament;
            const updatedBracket = tournament.bracket.map((match) =>
              match.matchId === matchId ? { ...match, ...matchData } : match
            );
            return { ...tournament, bracket: updatedBracket };
          }),
        }));
      },

      getTournamentById: (id) => {
        return get().tournaments.find((t) => t.tournamentId === id);
      },

      getMatchByTournamentAndMatchId: (tournamentId, matchId) => {
        const tournament = get().tournaments.find(
          (t) => t.tournamentId === tournamentId
        );
        
        if (!tournament) return null;
        return tournament.bracket.find((match) => match.matchId === matchId);
      },

    }),
    {
      name: "tournament-storage", // localStorage key
      partialize: (state) => ({ tournaments: state.tournaments }), // only store tournaments
    }
  )
);

export default useTournamentStore