import { useEffect } from "react";
import { useDepartmentStore } from "@/store/useDepartmentStore";
import { useTournamentStore, useTournamentTallyStore } from "@/store/useTournamentStore2";
import { useMatchStore } from "@/store/useMatchStore";
import { usePlayerStore, usePlayerStatsStore } from "@/store/usePlayerStore";
import { useSportsStore } from "@/store/useSportsStore";
import { useTeamStore, useTeamPlayersStore } from "@/store/useTeamStore";
import { useEventStore } from "@/store/useEventStore";


export function DataSync() {
    const { fetchDepartments } = useDepartmentStore();
    const { fetchTournaments } = useTournamentStore();
    const { fetchTournamentTally } = useTournamentTallyStore();
    const { fetchMatches } = useMatchStore();
    const { fetchPlayers } = usePlayerStore();
    const { fetchPlayerStats } = usePlayerStatsStore();
    const { fetchSports, fetchStats } = useSportsStore();
    const { fetchTeams } = useTeamStore();
    const { fetchTeamPlayers } = useTeamPlayersStore();
    const { fetchMatchPoints, fetchMatchParticipants } = useMatchStore();
    const { fetchEvents } = useEventStore();
    

    useEffect(() => {
        fetchDepartments();
        fetchTournaments();
        fetchTournamentTally();
        fetchMatches();
        fetchPlayers();
        fetchPlayerStats();
        fetchSports();
        fetchTeams();
        fetchTeamPlayers();
        fetchMatchPoints();
        fetchMatchParticipants();
        fetchStats();
        fetchEvents();
    }, [fetchDepartments, fetchTournaments, fetchTournamentTally, fetchMatches, fetchPlayers, fetchPlayerStats, fetchSports, fetchTeams, fetchTeamPlayers, fetchMatchPoints, fetchMatchParticipants, fetchStats, fetchEvents]);

    return null;
}