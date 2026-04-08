import React from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom"
import { useTournamentStore, useTournamentTeamStore, useTournamentMatchStore, useTournamentTallyStore } from "@/store/useTournamentStore2";
import { PageSync } from "@/components/custom/PageSync";
import { ArrowLeft, Dot, Edit3, SquareArrowOutUpRight, Download, RefreshCw, Eye } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { useEffect, useMemo } from "react";
import { useTeamStore } from "@/store/useTeamStore";
import { useSportsStore } from "@/store/useSportsStore";
import { formatDateToString } from "@/lib/helpers"
import { useEventStore } from "@/store/useEventStore";
import { useMatchPointsStore } from "@/store/useMatchStore";
import { jsPDF } from 'jspdf';
import { autoTable } from 'jspdf-autotable';
import html2canvas from 'html2canvas';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { TournamentBracketPreview, generateMockBracket } from "@/components/custom/TournamentBracketPreview";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export function Tournament() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const tournamentId = searchParams.get("t-id");
    const { tournament, fetchTournamentById } = useTournamentStore();
    const { sport, fetchSportById } = useSportsStore();
    const { events, fetchEvents } = useEventStore();
    const { teams, fetchTeams } = useTeamStore();
    const { tournamentTeams, fetchTournamentTeams } = useTournamentTeamStore();
    const { tournamentMatch, fetchTournamentMatch, updateTournamentMatch } = useTournamentMatchStore();
    const { tally, fetchTournamentTally } = useTournamentTallyStore();
    const { fetchAllMatchPoints } = useMatchPointsStore();

    const bracketRef = React.useRef(null);
    const [selectedEditMatch, setSelectedEditMatch] = React.useState(null);
    const [editTeamA, setEditTeamA] = React.useState(null);
    const [editTeamB, setEditTeamB] = React.useState(null);

    useEffect(() => {
        if (tournamentId) {
            fetchTournamentById(tournamentId);
            fetchTournamentTeams(tournamentId);
            fetchTournamentMatch(tournamentId);
            fetchTeams();
        }
    }, [fetchTournamentById, tournamentId, fetchTeams, fetchTournamentTeams, fetchTournamentMatch]);

    useEffect(() => {
        if (tournament?.sport_id) {
            fetchSportById(tournament.sport_id);
        }
    }, [tournament?.sport_id, fetchSportById]);

    useEffect(() => {
        fetchTournamentTally();
        fetchEvents();
        fetchAllMatchPoints();
    }, [fetchTournamentTally, fetchEvents, fetchAllMatchPoints]);


    const previewMatches = useMemo(() => {
        const teamIds = tournamentTeams.map(t => t.team_id);
        return generateMockBracket(teamIds, tournament?.bracketing, teams);
    }, [tournamentTeams, tournament?.bracketing, teams]);

    const tournamentEvent = events.find(e => e.event_id === tournament?.event_id)?.name;
    const tournamentTally = tally.filter(t => t.tournament_id === tournamentId);

    const exportTableToPDF = () => {
        const doc = new jsPDF();

        autoTable(doc, {
            head: [['Match name', 'Team A', 'Team B']],
            body: tournamentMatch?.map(match => [
                match?.match_name || '',
                teams.find(t => t.team_id === match.team_a_id)?.name || '',
                teams.find(t => t.team_id === match.team_b_id)?.name || '',
            ]),
        });

        doc.save('tournament-match.pdf');
    };

    const exportBracketToPDF = async () => {
        if (!bracketRef.current) return;
        try {
            const canvas = await html2canvas(bracketRef.current, { scale: 2 });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({
                orientation: 'landscape',
                unit: 'px',
                format: [canvas.width, canvas.height]
            });
            pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
            pdf.save(`${tournament.name}-bracket.pdf`);
        } catch (error) {
            console.error("Failed to export bracket", error);
        }
    };

    const handleSaveMatchEdit = async () => {
        if (!selectedEditMatch) return;
        const payload = {
            team_a_id: editTeamA,
            team_b_id: editTeamB
        };
        const success = await updateTournamentMatch(selectedEditMatch.match_id, payload);
        if (success) {
            fetchTournamentMatch(tournamentId);
            setSelectedEditMatch(null);
        }
    };


    return <>
        <PageSync page="Tournament Information" />
        <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="cursor-pointer" >
                <ArrowLeft />
            </button>
            <p className="text-lg font-semibold "></p>
        </div>
        <div className="flex items-start justify-between">
            <div className="flex flex-col items-start gap-2">
                <h1 className=" text-2xl text-red font-freshman tracking-widest">{tournament.name?.toUpperCase()}</h1>

                {tournamentEvent && (
                    <Link to={`/ManageEvents/${tournament.event_id}`} className="flex items-center gap-2 ">
                        <p className="text-muted-foreground">
                            Event:
                        </p>
                        <p className="flex items-center gap-1 text-blue-800 text-sm">
                            <SquareArrowOutUpRight size="14" />
                            {tournamentEvent}
                        </p>
                    </Link>
                )}


                <div className="flex text-sm items-center text-muted-foreground">
                    <p className="text-red font-medium">{sport.name}</p>
                    <Dot />
                    <p className="">{formatDateToString(tournament.start_date)} - {formatDateToString(tournament.end_date)}</p>
                </div>
                <p className=" mt-4 font-semibold">Teams Competing</p>
                <div className="flex items-center gap-3 flex-wrap">
                    {tournamentTeams.map(team => (
                        <Link to={`/ManageTeam/${team.team_id}`} key={team.tournament_team_id} className="flex items-center gap-2 mt-1 py-2 px-4 bg-red-50 text-red-800  border border-red-200 rounded-lg shadow-lg shadow-red-100 text-sm">
                            <SquareArrowOutUpRight size="16" />
                            <p >
                                {teams.find(t => t.team_id == team.team_id)?.name}
                            </p>
                        </Link>
                    ))}
                </div>

            </div>
            <Button variant="outline">
                Edit
                <Edit3 />
            </Button>
        </div>

        <div className='flex flex-col gap-2'>
            <div className="flex items-center justify-between">
                <p className=" text-2xl font-semibold ">Tournament Bracket</p>
                <div className="flex items-center gap-2">
                    <Button variant="outline" className="w-fit flex self-end" onClick={exportBracketToPDF}>
                        <Download className="size-4" />
                        Export PDF
                    </Button>
                    <Button variant="outline" className="w-fit flex self-end" onClick={fetchTournamentMatch}>
                        <RefreshCw className="size-4" />
                        Refresh
                    </Button>
                </div>

            </div>
            <TournamentBracketPreview
                bracketingType={tournament?.bracketing}
                matches={previewMatches}
                teams={teams}
            />
        </div>


        <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
                <p className=" text-2xl font-semibold ">Tournament Tally</p>
                <Button variant="outline" className="w-fit flex self-end" onClick={fetchTournamentTally}>
                    <RefreshCw className="size-4" />
                    Refresh
                </Button>
            </div>
            <div className="border overflow-hidden rounded-lg">
                <Table >
                    <TableHeader className="bg-muted">
                        <TableRow>
                            <TableHead> Team</TableHead>
                            <TableHead> Wins</TableHead>
                            <TableHead> Losses </TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {tournamentTally?.map((team, idx) => (
                            <TableRow key={idx}>
                                <TableCell>
                                    {teams.find(t => t.team_id == team.team_id)?.name}
                                </TableCell>
                                <TableCell>
                                    {team.wins}
                                </TableCell>
                                <TableCell>
                                    {team.losses}
                                </TableCell>
                                <TableCell >
                                    <Button variant="outline" size="sm"
                                    >
                                        <Eye />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

        </div>

        <Separator />

        <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
                <p className=" text-2xl font-semibold ">Match List</p>
                <Button variant="outline" className="w-fit flex self-end" onClick={exportTableToPDF}>
                    <Download className="size-4" />
                    Export to PDF
                </Button>
            </div>
            <div className="border overflow-hidden rounded-lg">
                <Table >
                    <TableHeader className="bg-muted">
                        <TableRow>
                            <TableHead> Match name</TableHead>
                            <TableHead> Team A</TableHead>
                            <TableHead> Team B</TableHead>
                            <TableHead> Date </TableHead>
                            <TableHead> Status </TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {tournamentMatch?.map((match, idx) => (
                            <TableRow key={idx}>
                                <TableCell >
                                    <p className="text-wrap  max-w-[240px]">
                                        {match.match_name}
                                    </p>
                                </TableCell>
                                <TableCell>
                                    <Link to={`/ManageTeam/${match.team_a_id}`} className="flex items-center gap-2 text-blue-800">
                                        <SquareArrowOutUpRight size="16" />
                                        {teams.find(t => t.team_id == match.team_a_id)?.short_name}
                                    </Link >
                                </TableCell>
                                <TableCell>
                                    <Link to={`/ManageTeam/${match.team_b_id}`} className="flex items-center gap-2 text-blue-800">
                                        <SquareArrowOutUpRight size="16" />
                                        {teams.find(t => t.team_id == match.team_b_id)?.short_name}
                                    </Link>
                                </TableCell>
                                <TableCell>{formatDateToString(match.date) || "--"}</TableCell>
                                <TableCell>
                                    {match.is_finished ? 'finished' : "on-going"}
                                </TableCell>
                                <TableCell className="flex gap-2 my-3">
                                    <Button variant="outline" size="sm"
                                        onClick={() => navigate(`/Sports/${sport.name}/scoring?tm-id=${match.match_id}`)}
                                    >
                                        <Eye />
                                    </Button>
                                    <Button variant="outline" size="sm" className="mr-2" onClick={() => {
                                        setSelectedEditMatch(match);
                                        setEditTeamA(match.team_a_id ? String(match.team_a_id) : 'empty');
                                        setEditTeamB(match.team_b_id ? String(match.team_b_id) : 'empty');
                                    }}>
                                        <Edit3 className=" h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}

                        {tournamentMatch?.length < 1 && (
                            <TableRow >
                                <TableCell colSpan={7} className="text-center">No match created</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

        </div>

        {/* Edit Match Dialog */}
        <Dialog open={!!selectedEditMatch} onOpenChange={(open) => !open && setSelectedEditMatch(null)}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Match Teams</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label>Team A</Label>
                        <Select value={editTeamA} onValueChange={setEditTeamA}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select Team A" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="empty">TBD (To Be Decided)</SelectItem>
                                {tournamentTeams.map(t => (
                                    <SelectItem key={t.team_id} value={String(t.team_id)}>
                                        {teams.find(tm => tm.team_id === t.team_id)?.name || "Unknown"}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid gap-2">
                        <Label>Team B</Label>
                        <Select value={editTeamB} onValueChange={setEditTeamB}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select Team B" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="empty">TBD (To Be Decided)</SelectItem>
                                {tournamentTeams.map(t => (
                                    <SelectItem key={t.team_id} value={String(t.team_id)}>
                                        {teams.find(tm => tm.team_id === t.team_id)?.name || "Unknown"}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setSelectedEditMatch(null)}>Cancel</Button>
                    <Button onClick={handleSaveMatchEdit}>Save Changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>


    </>
}