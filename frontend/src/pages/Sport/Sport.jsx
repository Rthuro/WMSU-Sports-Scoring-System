import { PageSync } from "@/components/custom/PageSync"
import { useParams, useNavigate, Link } from "react-router-dom"
import { Card, CardHeader, CardFooter, CardTitle, CardContent } from "@/components/ui/card";
import { UsersRound, ArrowRight, ArrowLeft, CalendarClock, ArrowUpRight, Eye, SquareArrowOutUpRight, Edit3, Settings, UserCircle2, Users2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { ScoringDialogue } from "@/components/custom/scoring-dialogue";
import { StatsFilterTable } from "@/components/custom/stats-filter-table"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { useTournamentStore, useTournamentMatchStore } from "@/store/useTournamentStore2";
import { useEventStore } from "@/store/useEventStore";
import { useEffect, useState } from "react";
import { useMatchStore } from "@/store/useMatchStore";
import { useSportsStore } from "@/store/useSportsStore";
import { usePlayerStore, usePlayerStatsStore } from "@/store/usePlayerStore";
import { useTeamStore } from "@/store/useTeamStore";
import { formatDateToString, formatTime } from "@/lib/helpers";
import { Button } from "@/components/ui/button";
import { adminRoute } from "@/lib/helpers";

export function Sport() {
    const { sport } = useParams();
    const navigate = useNavigate();

    const { tournaments, fetchTournaments } = useTournamentStore();
    const { events } = useEventStore();
    const { matchBySport, fetchMatchBySports } = useMatchStore();
    const { sports, fetchSports } = useSportsStore();
    const { players, fetchPlayersBySport } = usePlayerStore();
    const { fetchMultiplePlayerStats } = usePlayerStatsStore();
    const { teamsBySport, fetchTeamsBySport } = useTeamStore();
    const { tournamentMatch, fetchTournamentMatch } = useTournamentMatchStore();

    useEffect(() => {
        fetchSports();
        fetchTournaments();
        fetchTournamentMatch();
    }, [fetchTournaments, fetchTournamentMatch, fetchSports]);

    const sportsData = sports.find(s => s.name.toLowerCase() === sport.toLowerCase());

    useEffect(() => {
        if (sportsData) {
            fetchTeamsBySport(sportsData.sport_id);
            fetchPlayersBySport(sportsData.sport_id);
            fetchMatchBySports(sportsData?.sport_id);
        }
    }, [sportsData, fetchTeamsBySport, fetchMatchBySports, fetchPlayersBySport]);

    const tournamentMatchList = tournamentMatch?.filter(t => t.sport_id == sportsData?.sport_id) || [];
    const sportTournaments = tournaments?.filter(t => t.sport_id == sportsData?.sport_id) || [];

    const [playerStats, setPlayerStats] = useState([]);

    useEffect(() => {
        async function loadTeamStats() {
            const teamPlayerIds = players.map(p => p.player_id);

            const stats = await fetchMultiplePlayerStats(teamPlayerIds.join(","));
            setPlayerStats(stats || []);
        }

        if (players?.length > 0) {
            loadTeamStats();
        }
    }, [players, fetchMultiplePlayerStats]);

    const displayPlayerStats = playerStats.reduce((acc, stat) => {
        let existingPlayer = acc.find(s => s.player_id === stat.player_id);
        const statName = stat.stats_name || "Unknown Stat";
        const statValue = parseInt(stat.value, 10) || 0;
        const teamName = stat.team_name || "Unknown Team";

        if (!existingPlayer) {
            existingPlayer = {
                player_id: stat.player_id,
                player_name: stat.player_name,
                teams: {}
            };
            acc.push(existingPlayer);
        }

        if (!existingPlayer.teams[teamName]) {
            existingPlayer.teams[teamName] = {
                matches: new Set(),
                stats: {}
            };
        }

        existingPlayer.teams[teamName].matches.add(stat.match_id);

        if (!existingPlayer.teams[teamName].stats[statName]) {
            existingPlayer.teams[teamName].stats[statName] = 0;
        }
        existingPlayer.teams[teamName].stats[statName] += statValue;

        return acc;
    }, []);

    const finalPlayerStats = displayPlayerStats.map(p => ({
        ...p,
        teamsData: Object.entries(p.teams).map(([teamName, data]) => ({
            teamName,
            totalMatches: data.matches.size,
            stats: data.stats
        }))
    }));

    return <>
        <PageSync page="Sport" />
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                <button onClick={() => navigate(-1)} className="cursor-pointer" ><ArrowLeft /></button>
                <h1 className=" text-xl font-semibold ">{sportsData?.name}</h1>
            </div>
            <Link to={adminRoute(`Sports/EditSport?id=${sportsData?.sport_id}`)}>
                <Button variant="outline" >
                    <Settings className="size-4 " />
                    Settings
                </Button>
            </Link>

        </div>


        <div className=" dark:*:data-[slot=card]:bg-card grid grid-cols-2 gap-3  @xl/main:grid-cols-2 @5xl/main:grid-cols-3 ">
            <Link to={adminRoute(`Sports/${sportsData?.name}/AddPlayer`)} >
                <Card className="@container/card bg-white shadow-md border border-red-100 shadow-red-50  cursor-pointer">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-3 tabular-nums ">
                            <div className="bg-red-50 text-red border border-red-200 rounded-lg p-3">
                                <UserCircle2 className="size-5 " />
                            </div>
                            <div>
                                <p className="text-lg @[250px]/card:text-xl font-semibold">{players.length}</p>
                                <p className="text-accent-foreground text-sm font-normal">Players</p>
                            </div>
                        </CardTitle>
                    </CardHeader>
                    <CardFooter className="flex-col flex gap-3">
                        <Separator />
                        <div className="flex items-center justify-between w-full text-red text-sm">
                            <p>Add player</p>
                            <ArrowRight className="size-4 " />
                        </div>
                    </CardFooter>
                </Card>
            </Link>
            <Link to={adminRoute(`ManageTournament/CreateTournament`)} >
                <Card className="@container/card bg-white shadow-md border border-red-100 shadow-red-50 hover:shadow-lg cursor-pointer">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-3 tabular-nums ">
                            <div className="bg-red-50 text-red border border-red-200 rounded-lg p-3">
                                <CalendarClock className="size-5 " />
                            </div>
                            <div>
                                <p className="text-lg @[250px]/card:text-xl font-semibold">
                                    {tournaments?.length}
                                </p>
                                <p className="text-accent-foreground text-sm font-normal">Tournament(s)</p>
                            </div>
                        </CardTitle>
                    </CardHeader>
                    <CardFooter className="flex-col flex gap-3">
                        <Separator />
                        <div className="flex items-center justify-between w-full text-red text-sm">
                            <p>Set Tournament</p>
                            <ArrowRight className="size-4 " />
                        </div>
                    </CardFooter>
                </Card>
            </Link>
            <Link to={adminRoute(`TeamManagement/CreateTeam`)} >
                <Card className="@container/card bg-white shadow-md border border-red-100 shadow-red-50 hover:shadow-lg cursor-pointer">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-3 tabular-nums ">
                            <div className="bg-red-50 text-red border border-red-200 rounded-lg p-3">
                                <Users2 className="size-5 " />
                            </div>
                            <div>
                                <p className="text-lg @[250px]/card:text-xl font-semibold">
                                    {teamsBySport.length}
                                </p>
                                <p className="text-accent-foreground text-sm font-normal">Team(s)</p>
                            </div>
                        </CardTitle>
                    </CardHeader>
                    <CardFooter className="flex-col flex gap-3">
                        <Separator />
                        <div className="flex items-center justify-between w-full text-red text-sm">
                            <p>Create team(s)</p>
                            <ArrowRight className="size-4 " />
                        </div>
                    </CardFooter>
                </Card>
            </Link>
        </div>

        <Separator />

        <h1 className=" text-xl font-semibold ">Sport Scoring</h1>
        <ScoringDialogue sport={sportsData} />


        <Separator />
        <div className="flex flex-col gap-3 max-w-[70vw]">
            <p className=" text-xl font-semibold ">Player Stats</p>
            {finalPlayerStats.length === 0 ? (
                <p className="text-muted-foreground text-center">No player stats found.</p>
            ) : (
                <div className="flex overflow-x-auto pb-1 gap-4">
                    {finalPlayerStats.map((stat) => (
                        <Card key={stat.player_id} className="flex flex-col min-w-64">
                            <CardHeader className="border-b">
                                <CardTitle className="flex justify-between items-center text-lg">
                                    <span className="truncate">{stat.player_name}</span>
                                    <Link to={adminRoute(`Player?id=${stat.player_id}`)} className="text-blue-600 hover:text-blue-800 shrink-0">
                                        <SquareArrowOutUpRight size="16" />
                                    </Link>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="flex flex-col gap-4 flex-1">
                                {stat.teamsData.map((team, idx) => (
                                    <div key={idx} className="flex flex-col gap-2">
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="font-semibold text-slate-700">{team.teamName}</span>
                                            <span className="text-xs text-muted-foreground">{team.totalMatches} match{team.totalMatches > 1 ? "es" : ""}</span>
                                        </div>
                                        <div className="flex flex-wrap gap-1.5">
                                            {Object.entries(team.stats).map(([statName, val]) => (
                                                <span key={statName} className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full border border-slate-200">
                                                    {statName}: <span className="font-semibold">{val}</span>
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>

        <Separator />
        
        <div className="flex flex-col gap-3">
            <p className=" text-xl font-semibold ">Match List</p>
            <div className="border overflow-hidden rounded-lg">
                <Table >
                    <TableHeader className="bg-muted">
                        <TableRow>
                            <TableHead> Match name</TableHead>
                            <TableHead> Type </TableHead>
                            <TableHead> Participants</TableHead>
                            <TableHead> Date created </TableHead>
                            <TableHead> Start time </TableHead>
                            <TableHead> End time </TableHead>
                            <TableHead>Actions </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {matchBySport?.map((match, idx) => (
                            <TableRow key={idx}>
                                <TableCell >
                                    <p className="text-wrap  max-w-[240px]">
                                        {match.match_name || "--"}
                                    </p>
                                </TableCell>
                                <TableCell >
                                    {match.is_team ? "Team" : "Individual"}
                                </TableCell>
                                <TableCell>
                                    {match.is_team ? (
                                        <div className="flex items-center gap-1">
                                            <Link to={adminRoute(`ManageTeam?type=regular&id=${match.team_a_id}`)} className="flex items-center gap-2 text-blue-800">
                                                <SquareArrowOutUpRight size="16" />
                                                {match.team_a}
                                            </Link >
                                            <p>vs</p>
                                            <Link to={adminRoute(`ManageTeam?type=regular&id=${match.team_b_id}`)} className="flex items-center gap-2 text-blue-800">
                                                <SquareArrowOutUpRight size="16" />
                                                {match.team_b}
                                            </Link >
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-1">
                                            <Link to={adminRoute(`Player?id=${match.player_a_id}`)} className="flex items-center gap-2 text-blue-800">
                                                <SquareArrowOutUpRight size="16" />
                                                {match.player_a}
                                            </Link >
                                            <p>vs</p>
                                            <Link to={adminRoute(`Player?id=${match.player_b_id}`)} className="flex items-center gap-2 text-blue-800">
                                                <SquareArrowOutUpRight size="16" />
                                                {match.player_b}
                                            </Link >
                                        </div>
                                    )}
                                </TableCell>
                                <TableCell>{formatDateToString(match.date) || "--"}</TableCell>
                                <TableCell>{formatTime(match.start_time) || "--"}</TableCell>
                                <TableCell>{formatTime(match.end_time) || "--"}</TableCell>
                                <TableCell className="flex gap-2 my-3">
                                    <Button variant="outline" size="sm"
                                        onClick={() => navigate(adminRoute(`Sports/${sport}/scoring?m-id=${match.match_id}`))}
                                    >
                                        <Eye />
                                    </Button>
                                    <Button variant="outline" size="sm" className="mr-2" >
                                        <Edit3 className=" h-4 w-4" />
                                    </Button>
                                    {/* <Link className="text-red-600 hover:underline" 
                                    to={`/Sports/${match.sportName}/scoring?tm-id=${match.tournamentId}&m-id=${match.matchId}`}>
                                        view
                                    </Link> */}
                                </TableCell>
                            </TableRow>
                        ))}

                        {matchBySport?.length < 1 && (
                            <TableRow >
                                <TableCell colSpan={7} className="text-center">No match created</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

        </div>
        <Separator />
        <p className=" text-xl font-semibold -mb-3">Sport Tournaments</p>
        <div className=" dark:*:data-[slot=card]:bg-card grid grid-cols-2 gap-4 *:data-[slot=card]:bg-gradient-to-t md:grid-cols-3">
            {sportTournaments.length > 0 ? sportTournaments?.map(t => (
                <Link key={t.tournament_id}
                    to={adminRoute(`ManageTournament/Tournament?t-id=${t.tournament_id}`)}
                    data-slot="card" className="flex items-start justify-between rounded-2xl py-3 px-5 border bg-white border-red-100 shadow-red-50 shadow-lg hover:bg-white/60 hover:shadow-red-100 cursor-pointer">
                    <div className="flex flex-col items-start justify-between ">
                        <p className="text-lg font-bold tabular-nums text-red">
                            {t.name}
                        </p>
                        <p className="text-muted-foreground text-sm">
                            {events.find(e => e.event_id === t?.event_id)?.name || ""}
                        </p>
                    </div>
                    <div className="bg-red-50 text-red/80 border border-red-200 rounded-lg p-2">
                        <ArrowUpRight className="size-5 " />
                    </div>
                </Link>
            )) : (
                <p className="text-muted-foreground mx-auto col-span-2 md:col-span-3">No tournaments available for this sport.</p>
            )}
        </div>

    </>
}
