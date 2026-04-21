import { PageSync } from "@/components/custom/PageSync"
import { useParams, useNavigate, Link } from "react-router-dom"
import { Card, CardHeader, CardFooter, CardTitle } from "@/components/ui/card";
import { UsersRound, ArrowRight, ArrowLeft, CalendarClock, ArrowUpRight, Eye, SquareArrowOutUpRight, Edit3 } from "lucide-react";
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
import { useEffect } from "react";
import { useMatchStore } from "@/store/useMatchStore";
import { useSportsStore } from "@/store/useSportsStore";
import { usePlayerStore } from "@/store/usePlayerStore";
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

    console.log(matchBySport)

    return <>
        <PageSync page="Sport" />
        <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="cursor-pointer" ><ArrowLeft /></button>
            <h1 className=" text-xl font-semibold ">{sportsData?.name}</h1>
        </div>

        <div className=" dark:*:data-[slot=card]:bg-card grid grid-cols-2 gap-3  @xl/main:grid-cols-2 @5xl/main:grid-cols-3 ">
            <Link to={adminRoute(`Sports/${sportsData?.name}/AddPlayer`)} >
                <Card className="@container/card bg-white shadow-md border border-red-100 shadow-red-50  cursor-pointer">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-3 tabular-nums ">
                            <div className="bg-red-50 text-red border border-red-200 rounded-lg p-3">
                                <UsersRound className="size-5 " />
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
                                <CalendarClock className="size-5 " />
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
        <div className="flex flex-col gap-3">
            <p className=" text-xl font-semibold ">Player Stats</p>
            {/* <StatsFilterTable /> */}
        </div>

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
        <div className="flex flex-col gap-3">
            <p className=" text-xl font-semibold ">Match List</p>
            <div className="border overflow-hidden rounded-lg">
                <Table >
                    <TableHeader className="bg-muted">
                        <TableRow>
                            <TableHead> Match name</TableHead>
                            <TableHead> Team A</TableHead>
                            <TableHead> Team B</TableHead>
                            <TableHead> Date created </TableHead>
                            <TableHead> Start time </TableHead>
                            <TableHead> End time </TableHead>
                            <TableHead>Actions </TableHead>

                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {tournamentMatchList?.map((match, idx) => (
                            <TableRow key={idx}>
                                <TableCell >
                                    <p className="text-wrap  max-w-[240px]">
                                        {match.match_name}
                                    </p>
                                </TableCell>
                                <TableCell>
                                    <Link to={adminRoute(`ManageTeam/${match.team_a_id}`)} className="flex items-center gap-2 text-blue-800">
                                        <SquareArrowOutUpRight size="16" />
                                        {teamsBySport.find(t => t.team_id == match.team_a_id)?.short_name}
                                    </Link >
                                </TableCell>
                                <TableCell>
                                    <Link to={adminRoute(`ManageTeam/${match.team_b_id}`)} className="flex items-center gap-2 text-blue-800">
                                        <SquareArrowOutUpRight size="16" />
                                        {teamsBySport.find(t => t.team_id == match.team_b_id)?.short_name}
                                    </Link>
                                </TableCell>
                                <TableCell>{formatDateToString(match.date) || "--"}</TableCell>
                                <TableCell className="flex gap-2 my-3">
                                    <Button variant="outline" size="sm"
                                        onClick={() => navigate(`/Sports/${sport}/scoring?tm-id=${match.tournament_id}`)}
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

                        {tournamentMatchList?.length < 1 && (
                            <TableRow >
                                <TableCell colSpan={7} className="text-center">No match created</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

        </div>
    </>
}
