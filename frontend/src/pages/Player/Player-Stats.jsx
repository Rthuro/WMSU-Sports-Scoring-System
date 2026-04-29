import { PageSync } from "@/components/custom/PageSync"
import { useSportsStore } from "@/store/useSportsStore"
import { useEffect, useState } from "react"
import { usePlayerStore, usePlayerStatsStore } from "@/store/usePlayerStore"
import { Input } from "@/components/ui/input"
import { adminRoute, capitalizeFirstLetter } from "@/lib/helpers"
import { useMatchStore } from "@/store/useMatchStore"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Eye } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Link } from "react-router-dom"

export function PlayerStats() {
    const { sports, stats } = useSportsStore();
    const { players } = usePlayerStore();
    const { playerStats } = usePlayerStatsStore();
    const { matchParticipants } = useMatchStore();

    const [selectedSport, setSelectedSport] = useState("all");
    const [sportTableHeaders, setSportTableHeaders] = useState([]);

    const [displayPlayers, setDisplayPlayers] = useState(players);

    useEffect(() => {
        if (selectedSport) {
            const sportStats = stats?.filter(stat => stat.sport_id === selectedSport);
            setSportTableHeaders(sportStats);
        }
    }, [selectedSport, stats]);

    // Count total matches this player has participated in
    const getMatchPlayed = (playerId) => {
        return matchParticipants.filter(mp => mp.player_id === playerId).length;
    };

    // Count wins or losses for a player from match_participants
    const getTotalMatchStats = (stat, playerId) => {
        const playerMatches = matchParticipants.filter(mp => mp.player_id === playerId);

        if (stat === "wins") {
            return playerMatches.filter(mp => mp.is_winner === true).length;
        } else if (stat === "losses") {
            return playerMatches.filter(mp => mp.is_losser === true).length;
        }

        return 0;
    };

    const getPlayerStats = (stats_id, playerId) => {
        let value = 0;
        playerStats.forEach(ps => {
            if (ps.player_id === playerId && ps.stats_id === stats_id) {
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
                    }}
                />
                <Select
                    value={selectedSport}
                    onValueChange={(e) => {
                        setSelectedSport(e);
                        e === "all" ? setDisplayPlayers(players) :
                            setDisplayPlayers(players.filter(p => p.sport_id === e));
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
                    <TableHeader className="bg-muted">
                        <TableRow>
                            <TableHead>Player</TableHead>
                            <TableHead>Total Match Played</TableHead>
                            <TableHead>Match Wins</TableHead>
                            <TableHead>Match Losses</TableHead>

                            {sportTableHeaders && sportTableHeaders.map(header => (
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
                                    <div className="flex items-center gap-2">
                                        <Avatar className="w-8 h-8 rounded-lg">
                                            <AvatarImage
                                                src={player.photo}
                                                alt={player.first_name}
                                            />
                                            <AvatarFallback>{player.first_name[0]}{player.last_name?.[0]}</AvatarFallback>
                                        </Avatar>
                                        {player.first_name} {player.last_name}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    {getMatchPlayed(player.player_id)}
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
                                    <Link to={adminRoute(`Player?id=${player.player_id}`)} className="cursor-pointer">
                                        <Eye className="h-4 w-4" />
                                    </Link>
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