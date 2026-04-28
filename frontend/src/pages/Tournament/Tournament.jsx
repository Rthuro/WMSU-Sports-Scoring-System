import React from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom"
import { useTournamentStore, useTournamentTeamStore, useTournamentMatchStore, useTournamentTallyStore } from "@/store/useTournamentStore2";
import { PageSync } from "@/components/custom/PageSync";
import { ArrowLeft, Dot, Edit3, SquareArrowOutUpRight, Download, RefreshCw, Eye, MapPin } from "lucide-react";
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
import { useEffect, useMemo, useRef, useState } from "react";
import { useTeamStore } from "@/store/useTeamStore";
import { useSportsStore } from "@/store/useSportsStore";
import { formatDateToString } from "@/lib/helpers"
import { useEventStore } from "@/store/useEventStore";
import { useMatchPointsStore } from "@/store/useMatchStore";
import { jsPDF } from 'jspdf';
import { autoTable } from 'jspdf-autotable';
import { TournamentBracketPreview, generateMockBracket } from "@/components/custom/TournamentBracketPreview";
import { MatchDetailsDialog } from "@/components/custom/MatchDetailsDialog";
import { EditTournamentDialog } from "@/components/custom/EditTournamentDialog";
import { TeamRecordDialog } from "@/components/custom/TeamRecordDialog";
import { adminRoute } from "@/lib/helpers";
import sample_bg from "@/assets/sample.jpg";
import html2canvas from 'html2canvas-pro';


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
    const { tally, fetchTournamentTally, updateTournamentTally } = useTournamentTallyStore();
    const { fetchAllMatchPoints } = useMatchPointsStore();

    const bracketRef = useRef(null);
    const [selectedEditMatch, setSelectedEditMatch] = useState(null);
    const [isEditTournamentOpen, setIsEditTournamentOpen] = useState(false);
    const [selectedTeamRecord, setSelectedTeamRecord] = useState(null);

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

    // const handleSaveMatchEdit = async (payload) => {
    //     if (!selectedEditMatch) return;
    //     const success = await updateTournamentMatch(selectedEditMatch.match_id, payload);

    //     if(payload.winner_id == payload.team_a_id) {
    //         await updateTournamentTally(tournamentId, payload.team_a_id,  {
    //             wins: tally.find(t => t.team_id === payload.team_a_id)?.wins + 1 || 1,
    //         });
    //         await updateTournamentTally(tournamentId, payload.team_b_id, {
    //             losses: tally.find(t => t.team_id === payload.team_b_id)?.losses + 1 || 1,
    //         });
    //     } else {
    //          await updateTournamentTally(tournamentId, payload.team_a_id,  {
    //             losses: tally.find(t => t.team_id === payload.team_a_id)?.losses + 1 || 1,
    //         });
    //         await updateTournamentTally(tournamentId, payload.team_b_id, {
    //             wins: tally.find(t => t.team_id === payload.team_b_id)?.wins + 1 || 1,
    //         });
    //     }

        

    //     if (success) {
    //         fetchTournamentMatch(tournamentId);
    //         setSelectedEditMatch(null);
    //         fetchTournamentTally();
    //     }
    // };

    const handleSaveMatchEdit = async (payload) => {
        if (!selectedEditMatch) return;

        try {
            const res = await updateTournamentMatch(selectedEditMatch.match_id, payload);

            if(res){
                fetchTournamentMatch(tournamentId);
                setSelectedEditMatch(null);
                recountTournamentTally()
            }
           
        } catch (error) {
            console.error("Error updating match", error);
        }


    };

    const recountTournamentTally = async () => {
        
        const updatePromises = tournamentTeams.map(async (team) => {
            const teamId = team.team_id;
            
            const teamMatches = tournamentMatch.filter(m => 
                (m.team_a_id === teamId || m.team_b_id === teamId) && m.winner_id
            );

            const wins = teamMatches.filter(m => m.winner_id === teamId).length;
            const losses = teamMatches.length - wins;

            return updateTournamentTally(tournamentId, teamId, {
                wins: wins,
                losses: losses,
            });
        });

        await Promise.all(updatePromises);
        
        fetchTournamentTally();
    };

    return <>
        <PageSync page="Tournament Information" />
        <div className="flex items-center justify-between gap-3">
            <button onClick={() => navigate(-1)} className="cursor-pointer" >
                <ArrowLeft />
            </button>
            <Button variant="outline" onClick={() => setIsEditTournamentOpen(true)}>
                Edit
                <Edit3 />
            </Button>
        </div>
        <div
        className="relative bg-cover bg-center w-full h-[280px] rounded-lg overflow-hidden"
        style={{ backgroundImage: `url(${tournament?.banner_image || sample_bg})` }}
        >
            <div className="absolute top-0 right-0 left-0 bottom-0 bg-black opacity-50"></div>
                <div className="absolute top-0 right-0 left-0 bottom-0 flex flex-col items-center justify-center gap-2 drop-shadow-lg">
                    <h1 className=" text-3xl text-white font-freshman tracking-widest">{tournament.name?.toUpperCase()}</h1>
                    <p className="text-white ">{tournament.description}</p>

                    <p className="text-red font-semibold flex items-center gap-2 bg-white px-4 py-1 rounded-full">
                    {tournament?.start_date
                        ? formatDateToString(tournament.start_date)
                        : "Start Date"}
                    <span>-</span>
                    {tournament?.end_date
                        ? formatDateToString(tournament.end_date)
                        : " End Date"}
                    </p>
                    <p className="text-white flex items-center gap-1">
                    <MapPin className="inline size-4" />
                    {tournament?.location || "Event Location"}
                    </p>
                </div>
        </div>
        <div className="flex items-start justify-between">
            <div className="flex flex-col items-start gap-1">

                {tournamentEvent && (
                    <Link to={adminRoute(`ManageEvents/${tournament.event_id}`)} className="flex items-center gap-2 ">
                         <p className="text-muted-foreground">
                            Event:
                        </p>
                        <p className="flex items-center gap-1 text-blue-800 text-sm">
                            <SquareArrowOutUpRight size="14" />
                            {tournamentEvent}
                        </p>
                        <Dot className="inline text-muted-foreground size-4" />
                        <p className="text-red font-medium">{sport.name}</p>
                    </Link>
                )}

                <p className=" mt-4 font-semibold">Teams Competing</p>
                <div className="flex items-center gap-3 flex-wrap">
                    {tournamentTeams.map(team => (
                        <Link to={adminRoute(`ManageTeam?type=tournament&id=${team.team_id}`)} key={team.tournament_team_id} className="flex items-center gap-2 mt-1 py-2 px-4 bg-red-50 text-red-800  border border-red-200 rounded-lg shadow-lg shadow-red-100 text-sm">
                            <SquareArrowOutUpRight size="16" />
                            <p >
                                {teams.find(t => t.team_id == team.team_id)?.name}
                            </p>
                        </Link>
                    ))}
                </div>

            </div>
        </div>

        <div className='flex flex-col gap-2'>
            <div className="flex items-center justify-between">
                <p className=" text-2xl font-semibold ">Tournament Bracket</p>
                <div className="flex items-center gap-2">
                    <Button variant="outline" className="w-fit flex self-end" onClick={exportBracketToPDF}>
                        <Download className="size-4" />
                        Export PDF
                    </Button>
                    {/* <Button variant="outline" className="w-fit flex self-end" onClick={fetchTournamentMatch}>
                        <RefreshCw className="size-4" />
                        Refresh
                    </Button> */}
                </div>

            </div>
            <div ref={bracketRef} className="w-full bg-white rounded-lg p-4">
                <TournamentBracketPreview
                    bracketingType={tournament?.bracketing}
                    matches={tournamentMatch && tournamentMatch.length > 0 ? tournamentMatch : previewMatches}
                    teams={teams}
                    onMatchClick={(match) => {
                        if (!match) return;
                        setSelectedEditMatch(match);
                    }}
                />
            </div>
        </div>


        <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
                <p className=" text-2xl font-semibold ">Tournament Tally</p>
                <Button variant="outline" className="w-fit flex self-end" onClick={recountTournamentTally}>
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
                            <TableHead> Match Records</TableHead>
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
                                    <Button variant="outline" size="sm" onClick={() => setSelectedTeamRecord(team.team_id)}>
                                        <Eye className="w-4 h-4 mr-2" />
                                        View
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
                            <TableHead> Winner </TableHead>
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
                                    <Link to={adminRoute(`ManageTeam?type=tournament&id=${match.team_a_id}`)} 
                                    className="flex items-center gap-2 text-blue-800">
                                        <SquareArrowOutUpRight size="16" />
                                        {teams.find(t => t.team_id == match.team_a_id)?.short_name}
                                    </Link >
                                </TableCell>
                                <TableCell>
                                    <Link to={adminRoute(`ManageTeam?type=tournament&id=${match.team_b_id}`)} className="flex items-center gap-2 text-blue-800">
                                        <SquareArrowOutUpRight size="16" />
                                        {teams.find(t => t.team_id == match.team_b_id)?.short_name}
                                    </Link>
                                </TableCell>
                                <TableCell>{formatDateToString(match.date) || "--"}</TableCell>
                                <TableCell>
                                    {match.winner_id == match.team_a_id ? teams.find(t => t.team_id == match.team_a_id)?.short_name : match.winner_id == match.team_b_id ? teams.find(t => t.team_id == match.team_b_id)?.short_name : "--"}
                                </TableCell>
                                <TableCell>
                                    {match.is_finished ? 'finished' : "on-going"}
                                </TableCell>
                                <TableCell className="flex gap-2 my-3">
                                    <Button variant="outline" size="sm"
                                        onClick={() => navigate(adminRoute(`Sports/${sport.name}/scoring?tm-id=${match.match_id}`))}
                                    >
                                        <Eye />
                                    </Button>
                                    <Button variant="outline" size="sm" className="mr-2" onClick={() => {
                                        setSelectedEditMatch(match);
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

        {/* Edit Match Dialog Custom Component */}
        <MatchDetailsDialog
            isOpen={!!selectedEditMatch}
            onClose={() => setSelectedEditMatch(null)}
            match={selectedEditMatch}
            tournamentTeams={tournamentTeams}
            teams={teams}
            onSave={handleSaveMatchEdit}
        />

        <EditTournamentDialog
            isOpen={isEditTournamentOpen}
            onClose={() => setIsEditTournamentOpen(false)}
            tournament={tournament}
        />

        <TeamRecordDialog
            isOpen={!!selectedTeamRecord}
            onClose={() => setSelectedTeamRecord(null)}
            teamId={selectedTeamRecord}
            tournamentMatch={tournamentMatch}
            teams={teams}
        />

    </>
}