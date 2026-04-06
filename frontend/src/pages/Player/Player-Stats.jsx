import { PageSync } from "@/components/custom/PageSync"
import { StatsFilterTable } from "@/components/custom/stats-filter-table"
import { useSportsStore } from "@/store/useSportsStore"
import { useEffect, useState } from "react"
import { usePlayerStore, usePlayerStatsStore } from "@/store/usePlayerStore"
import { Input } from "@/components/ui/input"
import { capitalizeFirstLetter } from "@/lib/helpers"
import { useMatchStore } from "@/store/useMatchStore"
import { useTeamPlayersStore } from "@/store/useTeamStore"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Eye, ChevronDown } from "lucide-react"

export function PlayerStats(){
    const { sports, stats } = useSportsStore();
    const { players } = usePlayerStore();
    const { playerStats } = usePlayerStatsStore();
    const { matchPoints, matchParticipants } = useMatchStore();
    const { teamPlayers } = useTeamPlayersStore();

    const [selectedSport, setSelectedSport] = useState("all");
    const [sportTableHeaders, setSportTableHeaders] = useState([]);

    const [displayPlayers, setDisplayPlayers] = useState(players);

    useEffect(() => {
        if (selectedSport) {
            const sportStats = stats?.filter(stat => stat.sport_id === selectedSport);
            setSportTableHeaders(sportStats);
        } 
    }, [selectedSport, stats]);

    // // Helper to sum all matchPoints for a player
    const getTotalPoints = (playerId) => {
        return matchPoints
            .filter(mp => mp.player_id === playerId)
            .reduce((sum, mp) => sum + (mp.value || 0), 0);
    };

    const getTotalMatchStats = (stat, playerId) => {
        const playerTeam = teamPlayers.filter(tp => tp.player_id === playerId).team_id;
        const finishedMatches = () => {
            let matches = [];
            matchParticipants.forEach(mp => {
                if(mp.team_id === playerTeam && mp.is_finished){
                    matches.push(mp);
                }
            });
            return matches;
        };

        let wins = 0;
        let losses = 0;

        finishedMatches()?.forEach(match => {
            if( match.is_winner){
                wins+=1;
            } else {
                losses+=1;
            }
        });

        if(stat === "wins"){
            return wins;
        } else if(stat === "losses"){
            return losses;
        }

        return 0;
    };

    const getPlayerStats = (stats_id, playerId) => {
        let value = 0;
        playerStats.forEach(ps => {
            if(ps.player_id === playerId && ps.stats_id === stats_id){
                value += ps.value;
            }
        });

        return value;
    }
    return <main className="flex flex-col gap-6">
            <PageSync page="Player Stats" />
            <h1 className=" text-xl font-semibold ">Player Stats</h1>
            <section className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                     <Input placeholder="Search team by name" className="w-1/3"
                        onChange={(e) => {
                            setDisplayPlayers(players.filter(player =>
                                player.first_name.toLowerCase().includes(e.target.value.toLowerCase()) ||
                                player.last_name.toLowerCase().includes(e.target.value.toLowerCase())
                            )); 
                        } }
                        />
                    <Select
                        value={selectedSport}
                        onValueChange={(e) => {
                            setSelectedSport(e);
                            e === "all" ? setDisplayPlayers(players) : 
                            setDisplayPlayers(players.filter(p => p.sport_id === e) );
                        }}
                    >
                        <SelectTrigger className="">
                            <SelectValue placeholder="Select sports" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="all">All sports</SelectItem>
                                {sports.map(sport => (
                                    <SelectItem key={sport.sport_id} value={sport.sport_id}>
                                        {sport.name}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                   
                </div>
                <section className="border rounded-lg overflow-hidden">
                <Table >
                    <TableHeader  className="bg-muted">
                        <TableRow>
                            <TableHead>Player</TableHead>
                            <TableHead>Total points</TableHead>
                            <TableHead>Match wins</TableHead>
                             <TableHead>Match losses</TableHead>
                            
                            { sportTableHeaders  && sportTableHeaders.map(header => (
                                <TableHead key={header.stats_id}>
                                    {capitalizeFirstLetter(header.stats_name)}
                                </TableHead>
                            ))}
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {displayPlayers?.length > 0 ? displayPlayers.map(player => (
                            <TableRow key={player.player_id}>
                                <TableCell>
                                    {player.first_name} {player.last_name}
                                </TableCell>
                                <TableCell>
                                    {getTotalPoints(player.player_id)}
                                </TableCell>
                                <TableCell>
                                    {getTotalMatchStats("wins", player.player_id)}
                                </TableCell>
                                <TableCell>
                                    {getTotalMatchStats("losses", player.player_id)}
                                </TableCell>
                                {sportTableHeaders && sportTableHeaders.map(header => (
                                    <TableCell key={header.stats_id}>
                                        {getPlayerStats(header.stats_id, player.player_id)}
                                    </TableCell>
                                ))}
                                <TableCell>
                                    <Button variant="outline" size="icon">
                                        <Eye className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        )) : (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center">No players found</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
                </section>
            </section>
    </main>
}