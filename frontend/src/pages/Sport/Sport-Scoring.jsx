import { useParams, useNavigate, useSearchParams } from "react-router-dom"
import { PageSync } from "@/components/custom/PageSync";
import { useMatchStore, useMatchPointsStore } from "@/store/useMatchStore";
import { useEffect, useState, useRef, useCallback } from "react";
import { ArrowLeft, Settings, ChevronLeft, ChevronRight, SquarePen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTournamentMatchStore } from "@/store/useTournamentStore2";
import { useSportsStore } from "@/store/useSportsStore";
import { useTeamStore, useTeamPlayersStore } from '@/store/useTeamStore';
import { usePlayerStore } from '@/store/usePlayerStore';
import { SportPoints } from "@/components/custom/sport-points";
import { getTimeStringForDB, getTimeInSeconds, combineDateAndTime, formatDateForInput, formatTimeForInput } from "@/lib/helpers";
import { Table, TableBody, TableCell, TableHeader, TableRow, TableHead } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useTournamentTallyStore } from "@/store/useTournamentStore2";
import { EditMatchSheet } from "@/components/custom/EditMatchSheet";
import { ScoreboardPlayerTable } from "@/components/custom/ScoreboardPlayerTable";
import { EditableValueInput } from "@/components/custom/EditableValueInput";

function useSaveMatchPoint() {
    const { addMatchPoint, updateMatchPoint } = useMatchPointsStore();

    const save = useCallback(async (matchInfo, matchPoints, scores, setNumber, timeMs) => {
        if (!matchInfo) return;

        const existing = matchPoints?.find(
            (mp) =>
                mp.team_a_id === matchInfo.team_a_id &&
                mp.team_b_id === matchInfo.team_b_id &&
                mp.set_number === setNumber
        );

        const payload = {
            match_id: matchInfo.match_id,
            team_a_id: matchInfo.team_a_id ?? null,
            team_b_id: matchInfo.team_b_id ?? null,
            player_a_id: matchInfo.player_a_id ?? null,
            player_b_id: matchInfo.player_b_id ?? null,
            a_score: scores.a ?? 0,
            b_score: scores.b ?? 0,
            set_number: setNumber,
            time: getTimeStringForDB(timeMs ?? 0),
        };

        if (existing) {
            if (scores.a !== existing.a_score || scores.b !== existing.b_score) {
                await updateMatchPoint({ ...payload, entry_id: existing.entry_id });
            }
        } else {
            if (scores.a > 0 || scores.b > 0) {
                await addMatchPoint(payload);
            }
        }
    }, [addMatchPoint, updateMatchPoint]);

    return save;
}

function recomputeWins(mpList) {
    let winsA = 0;
    let winsB = 0;

    mpList?.forEach((mp) => {
        const scoreA = Number(mp.a_score || 0);
        const scoreB = Number(mp.b_score || 0);

        if (scoreA > scoreB) {
            winsA++;
        } else if (scoreB > scoreA) {
            winsB++;
        }
    });
    return { winsA, winsB };
}


export function SportScoring() {
    const navigate = useNavigate();
    const { sport } = useParams();
    const [searchParams] = useSearchParams();
    const matchId = searchParams.get("m-id");
    const tournamentMatchId = searchParams.get("tm-id");
    const isQuickScoring = !matchId && !tournamentMatchId;
    const [loader, setLoader] = useState(false);

    const { matches, fetchMatches, updateMatch } = useMatchStore();
    const { updateMatchPoint, addMatchPoint, matchPoints, fetchMatchPoints } = useMatchPointsStore();
    const { match, fetchMatch, updateTournamentMatch } = useTournamentMatchStore();
    const { sports, fetchPenalties, penalties, fetchScoringPoints, scoringPoints, fetchSportById, fetchSports } = useSportsStore();
    const { teamsBySport, fetchTeamsBySport } = useTeamStore();
    const { ByTeamPlayers, fetchByTeamPlayers } = useTeamPlayersStore();
    const { players, fetchPlayersBySport } = usePlayerStore();
    const { tally, updateTournamentTally } = useTournamentTallyStore();

    const saveMatchPoint = useSaveMatchPoint();
    useEffect(() => {
        fetchSports();
        fetchMatches();
    }, [fetchMatches, fetchSports]);

    const sportData = sports.find((s) => s.name.toLowerCase() === sport?.toLowerCase());

    useEffect(() => {
        if (sportData) {
            fetchTeamsBySport(sportData.sport_id);
            fetchSportById(sportData.sport_id);
            fetchPlayersBySport(sportData.sport_id);
            fetchPenalties(sportData.sport_id);
            fetchScoringPoints(sportData.sport_id);
        }
    }, [sportData?.sport_id, fetchTeamsBySport, fetchSportById, fetchPlayersBySport, fetchPenalties, fetchScoringPoints]);

    useEffect(() => {
        if (tournamentMatchId) fetchMatch(tournamentMatchId);
    }, [tournamentMatchId, fetchMatch]);

    let matchInformation = null;
    if (matchId) matchInformation = matches.find((m) => m.match_id === matchId);
    if (tournamentMatchId) matchInformation = match;

    const isTeamMatch = matchInformation?.is_team !== false;

    useEffect(() => {
        if (matchInformation?.match_id) {
            fetchMatchPoints(matchInformation.match_id);
        }

    }, [matchInformation?.match_id, fetchMatchPoints]);

    const participantA = isTeamMatch
        ? teamsBySport.find((t) => t.team_id === matchInformation?.team_a_id)?.name
        : (() => {
            const p = players.find((p) => p.player_id === matchInformation?.player_a_id);
            return p ? `${p.first_name} ${p.last_name}` : null;
        })();

    const participantB = isTeamMatch
        ? teamsBySport.find((t) => t.team_id === matchInformation?.team_b_id)?.name
        : (() => {
            const p = players.find((p) => p.player_id === matchInformation?.player_b_id);
            return p ? `${p.first_name} ${p.last_name}` : null;
        })();


    const [teamAPlayers, setTeamAPlayers] = useState([]);
    const [teamBPlayers, setTeamBPlayers] = useState([]);

    useEffect(() => {
        if (isTeamMatch && matchInformation) {
            const fetchPlayers = async () => {
                if (matchInformation.team_a_id) {
                    const dataA = await fetchByTeamPlayers(matchInformation.team_a_id);
                    if (dataA) setTeamAPlayers(dataA);
                }
                if (matchInformation.team_b_id) {
                    const dataB = await fetchByTeamPlayers(matchInformation.team_b_id);
                    if (dataB) setTeamBPlayers(dataB);
                }
            };
            fetchPlayers();
        }
    }, [matchInformation?.team_a_id, matchInformation?.team_b_id, isTeamMatch, fetchByTeamPlayers]);

    const team_a_players = () => {
        if (!isTeamMatch) return [];
        return teamAPlayers?.map((player) => {
            const pInfo = players.find((p) => p.player_id === player.player_id);
            return { ...pInfo, ...player };
        }).filter(p => p.player_id);
    }

    const team_b_players = () => {
        if (!isTeamMatch) return [];
        return teamBPlayers?.map((player) => {
            const pInfo = players.find((p) => p.player_id === player.player_id);
            return { ...pInfo, ...player };
        }).filter(p => p.player_id);
    }

    const [matchPointsData, setMatchPointsData] = useState({
        set_number: 1,
        team_a_score: 0,
        team_b_score: 0,
        time: 0,
        a_wins: 0,
        b_wins: 0
    });

    const loadScoresForSet = useCallback((setNum) => {
        if (!matchInformation) return;
        const mp = matchPoints?.find(
            (m) =>
                m.team_a_id === matchInformation?.team_a_id &&
                m.team_b_id === matchInformation?.team_b_id &&
                m.set_number === setNum
        );
        const wins = recomputeWins(matchPoints);
        setMatchPointsData({
            set_number: setNum,
            team_a_score: mp?.a_score ?? 0,
            team_b_score: mp?.b_score ?? 0,
            time: getTimeInSeconds(mp?.time) || 0,
            a_wins: wins.winsA,
            b_wins: wins.winsB
        });
    }, [matchInformation, matchPoints]);

    useEffect(() => {
        if (matchInformation && matchPoints?.length >= 0) {
            loadScoresForSet(matchPointsData.set_number);
        }
    }, [matchInformation?.match_id, matchPoints?.length]);

    const [regularPenaltyA, changeRegularPenaltyA] = useState(0);
    const [regularPenaltyB, changeRegularPenaltyB] = useState(0);
    const [minusPenaltyA, changeMinusPenaltyA] = useState(0);
    const [minusPenaltyB, changeMinusPenaltyB] = useState(0);
    const [winner, setWinner] = useState({ teamA: 0, teamB: 0 });

    console.log("match points", matchPoints)
    // const computeWins = () => {
    //     let winsA = 0, winsB = 0;
    //     matchPoints?.forEach((mp) => {
    //         if (mp.a_score > mp.b_score) winsA++;
    //         else if (mp.b_score > mp.a_score) winsB++;
    //     });
    //     return { teamA: winsA, teamB: winsB };
    // };
    // const winner = computeWins();

    const [isRunning, setIsRunning] = useState(false);
    const timerRef = useRef(null);

    useEffect(() => {
        if (isRunning) {
            timerRef.current = setInterval(() => {
                setMatchPointsData((prev) => ({ ...prev, time: prev.time + 10 }));
            }, 10);
        } else {
            clearInterval(timerRef.current);
        }
        return () => clearInterval(timerRef.current);
    }, [isRunning]);

    const formatTime = (ms) => {
        const minutes = String(Math.floor(ms / 60000)).padStart(2, "0");
        const seconds = String(Math.floor((ms % 60000) / 1000)).padStart(2, "0");
        const milliseconds = String(Math.floor((ms % 1000) / 10)).padStart(2, "0");
        return `${minutes}:${seconds}.${milliseconds}`;
    };

    const [showWinnerModal, setShowWinnerModal] = useState(false);
    const [winnerName, setWinnerName] = useState("");

    const saveCurrentScores = useCallback(async () => {
        if (!matchInformation) return;
        await saveMatchPoint(
            matchInformation,
            matchPoints,
            { a: matchPointsData.team_a_score, b: matchPointsData.team_b_score },
            matchPointsData.set_number,
            matchPointsData.time
        );
    }, [matchInformation, matchPoints, matchPointsData, saveMatchPoint]);

    // ── Round/Set navigation ──────────────────────────────────────────
    const maxSets = sportData?.max_sets ?? 99;

    const changeRound = async (newSet) => {
        if (newSet < 1 || newSet > maxSets) return;
        // Save current round first
        await saveCurrentScores();
        // Reset penalties for new round
        changeRegularPenaltyA(0);
        changeRegularPenaltyB(0);
        changeMinusPenaltyA(0);
        changeMinusPenaltyB(0);
        // Load scores for the target round
        loadScoresForSet(newSet);
    };

    // ── End set / advance (original resetScoringState logic) ──────────
    const resetScoringState = async () => {
        const currentSet = matchPointsData.set_number;
        const defaultSets = sportData?.default_sets ?? 1;

        if (currentSet < defaultSets) {
            await saveCurrentScores();
            changeRegularPenaltyA(0);
            changeRegularPenaltyB(0);
            changeMinusPenaltyA(0);
            changeMinusPenaltyB(0);
            loadScoresForSet(currentSet + 1);
        }

        if (currentSet === defaultSets) {
            // Final set — determine winner
            const finalWinner = matchPointsData.team_a_score > matchPointsData.team_b_score
                ? (participantA ?? "Side A")
                : (participantB ?? "Side B");
            setWinnerName(finalWinner);
            setShowWinnerModal(true);

            // Tournament tally update
            if (matchInformation?.tournament_id) {
                const teamAtallyData = tally.find(
                    (t) => t.tournament_id === matchInformation.tournament_id && t.team_id === matchInformation.team_a_id
                );
                const teamBtallyData = tally.find(
                    (t) => t.tournament_id === matchInformation.tournament_id && t.team_id === matchInformation.team_b_id
                );

                await updateTournamentTally(matchInformation.tournament_id, matchInformation.team_a_id, {
                    wins: matchPointsData.team_a_score > matchPointsData.team_b_score
                        ? (teamAtallyData?.wins || 0) + 1 : (teamAtallyData?.wins || 0),
                    losses: matchPointsData.team_a_score < matchPointsData.team_b_score
                        ? (teamAtallyData?.losses || 0) + 1 : (teamAtallyData?.losses || 0),
                });

                await updateTournamentTally(matchInformation.tournament_id, matchInformation.team_b_id, {
                    wins: matchPointsData.team_b_score > matchPointsData.team_a_score
                        ? (teamBtallyData?.wins || 0) + 1 : (teamBtallyData?.wins || 0),
                    losses: matchPointsData.team_b_score < matchPointsData.team_a_score
                        ? (teamBtallyData?.losses || 0) + 1 : (teamBtallyData?.losses || 0),
                });

                await updateTournamentMatch(matchInformation.match_id, {
                    round: matchInformation.round + 1,
                    is_finished: true,
                });
            }

            await saveCurrentScores();
        }
    };

    // ── Back button (save & exit) ─────────────────────────────────────
    const handleBackButtonClick = async () => {
        if (!isQuickScoring) {
            await saveCurrentScores();
        }
        navigate(-1);
        if (tournamentMatchId) {
            await fetchAllMatchPoints();
            await fetchMatch(tournamentMatchId);
        }
    };

    const [sheetOpen, setSheetOpen] = useState(false);
    const [editFormData, setEditFormData] = useState({
        match_name: "",
        date: "",
        location: "",
        start_time: "",
        end_time: "",
        winner: null
    });

    const [loading, setLoading] = useState(false);
    useEffect(() => {
        if (matchInformation && sheetOpen) {
            setEditFormData({
                match_name: matchInformation.match_name || "",
                date: formatDateForInput(matchInformation.date) || "",
                location: matchInformation.location || "",
                start_time: formatTimeForInput(matchInformation.start_time) || "",
                end_time: formatTimeForInput(matchInformation.end_time) || "",
                winner: matchInformation.winner || null
            });
        }
    }, [matchInformation, sheetOpen]);

    const handleSaveMatchEdit = async () => {
        if (!matchInformation) return;
        setLoader(true);

        const payload = {
            ...editFormData,
            start_time: combineDateAndTime(editFormData.date, editFormData.start_time),
            end_time: combineDateAndTime(editFormData.date, editFormData.end_time)
        };

        const result = await updateMatch(matchInformation.match_id, payload);
        if (result) {
            setSheetOpen(false);
            fetchMatches();
        }
        setLoader(false);
    };

    const createPointsData = () => {
        const sets = sportData?.max_sets || 1;
        const data = [];
        for (let i = 1; i <= sets; i++) {
            const mp = matchPoints?.find(
                (m) =>
                    m.team_a_id === matchInformation?.team_a_id &&
                    m.team_b_id === matchInformation?.team_b_id &&
                    m.set_number === i
            );
            data.push({
                set_number: i,
                a_score: mp?.a_score ?? 0,
                b_score: mp?.b_score ?? 0,
                entry_id: mp?.entry_id ?? null,
                isActive: i === matchPointsData.set_number,
            });
        }
        return data;
    };

    const handleTableScoreChange = async (setNumber, side, value) => {
        const numValue = parseInt(value, 10);
        if (isNaN(numValue) || numValue < 0) return;

        // If editing the current active set, update live scoreboard too
        if (setNumber === matchPointsData.set_number) {
            setMatchPointsData((prev) => ({
                ...prev,
                [side === "a" ? "team_a_score" : "team_b_score"]: numValue,
            }));
        }
        
        // Find existing entry
        const existing = matchPoints?.find(
            (mp) =>
                mp.team_a_id === matchInformation?.team_a_id &&
                mp.team_b_id === matchInformation?.team_b_id &&
                mp.set_number === setNumber
        );

        const currentA = side === "a" ? numValue : (existing?.a_score ?? 0);
        const currentB = side === "b" ? numValue : (existing?.b_score ?? 0);

        await saveMatchPoint(
            matchInformation,
            matchPoints,
            { a: currentA, b: currentB },
            setNumber,
            matchPointsData.time
        );     

        setMatchPointsData((prev) => {
            const updatedMpList = matchPoints.map(mp => 
                mp.set_number === setNumber 
                ? { ...mp, a_score: currentA, b_score: currentB } 
                : mp
            );
            const wins = recomputeWins(updatedMpList);
            return {
                ...prev,
                a_wins: wins.winsA,
                b_wins: wins.winsB,
            };
        });

    };

    // ── Jump to round from table ──────────────────────────────────────
    const jumpToRound = async (setNum) => {
        await saveCurrentScores();
        loadScoresForSet(setNum);
    };

    const isArnis = sport?.toLowerCase() === "arnis";
    const setOrRound = sportData?.use_set_based_scoring ? "Set" : "Round";

    return <>
        {/* Winner Modal */}
        <Dialog open={showWinnerModal} onOpenChange={setShowWinnerModal}>
            <DialogContent className="max-w-[400px] p-6">
                <DialogHeader>
                    <DialogTitle className="text-center text-2xl">Match Winner!</DialogTitle>
                </DialogHeader>
                <div className="text-center py-4">
                    <p className="text-3xl font-bold text-green-700">{winnerName}</p>
                    <p className="mt-2 text-lg">is the winner of this match!</p>
                </div>
                <DialogFooter className="grid grid-cols-2 gap-4">
                    <Button onClick={() => setShowWinnerModal(false)}>Close</Button>
                    <Button onClick={() => navigate(-1)}>Exit</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>

        {!isQuickScoring && (
            <EditMatchSheet
                sheetOpen={sheetOpen}
                setSheetOpen={setSheetOpen}
                matchInformation={matchInformation}
                handleSaveMatchEdit={handleSaveMatchEdit}
                loading={loader}
                editFormData={editFormData}
                setEditFormData={setEditFormData}
            />
        )}

        <PageSync page={matchInformation?.match_name || "Quick Scoring"} />

        {/* ── Header ─────────────────────────────────────────────── */}
        <div className="flex items-center justify-between">
            <button onClick={handleBackButtonClick} className="cursor-pointer">
                <ArrowLeft />
            </button>
            {!isQuickScoring && (
                <Button
                    className="text-xs bg-green-700 hover:bg-green-600 text-white md:text-sm lg:text-md py-2 lg:py-5 cursor-pointer"
                    variant="default"
                    onClick={() => setSheetOpen(true)}
                >
                    <Settings className="mr-1 h-4 w-4" />
                    Edit Match
                </Button>
            )}
        </div>

        {/* ── Scoreboard ─────────────────────────────────────────── */}
        <main className="flex flex-col gap-6 mt-3 mb-6">
            <div className="grid grid-cols-3 min-h-[300px] sm:max-h-auto border-2">

                {/* ── Side A ─── */}
                <div className="flex flex-col items-center gap-6 bg-blue-50/60 text-blue-900 border-r-2">
                    <p className="text-lg text-center text-wrap pt-4 drop-shadow-sm">
                        {participantA ?? "Side A"}
                    </p>
                    <p className="text-7xl lg:text-9xl my-auto font-bold">
                        {matchPointsData.team_a_score}
                    </p>
                    {isArnis ? (
                        <div className="grid grid-cols-3 w-full">
                            <div className="flex-col flex items-center justify-center gap-3 py-3 bg-white w-full border-y-2 border-x">
                                <p className="font-medium border-b-2 text-center w-full pb-2 text-md md:text-sm">Regular Penalty</p>
                                <p className="text-3xl lg:text-5xl font-bold">{regularPenaltyA}</p>
                            </div>
                            <div className="flex-col flex items-center justify-center gap-3 py-3 bg-white w-full border-2">
                                <p className="font-medium border-b-2 text-center w-full pb-2 text-md md:text-sm">Penalty</p>
                                <p className="text-3xl lg:text-5xl font-bold">{minusPenaltyA}</p>
                            </div>
                            <div className="flex-col flex items-center justify-center gap-3 py-3 bg-white w-full border-2">
                                <p className="font-semibold border-b-2 text-center w-full pb-2 text-md md:text-sm">WIN</p>
                                <p className="text-3xl lg:text-5xl font-bold">{matchPointsData.a_wins}</p>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 w-full">
                            <div className="flex-col flex items-center justify-center gap-3 py-3 bg-white w-full border-1">
                                <p className="text-lg font-semibold border-b-2 text-center w-full pb-2">WIN</p>
                                <p className="text-3xl lg:text-6xl font-bold">{matchPointsData.a_wins}</p>
                            </div>
                            <div className="flex-col flex items-center justify-center gap-3 py-3 bg-white w-full border-1">
                                <p className="text-lg font-semibold border-b-2 text-center w-full pb-2">Penalty</p>
                                <p className="text-3xl lg:text-6xl font-bold">{regularPenaltyA}</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* ── Center (Timer + Round + Controls) ─── */}
                <div className="flex flex-col items-center gap-6">
                    {sportData?.timeperset && (
                        <p className="text-center text-3xl lg:text-6xl font-semibold pt-6 w-full">
                            {formatTime(matchPointsData.time || 0)}
                        </p>
                    )}

                    <div className="flex flex-col items-center bg-zinc-900 w-full flex-1">
                        <p className="text-center font-bold w-full py-3 text-white">{setOrRound}</p>
                        <p className="flex items-center justify-center text-4xl lg:text-5xl font-semibold py-6 bg-white w-full h-full">
                            {matchPointsData.set_number}
                        </p>
                    </div>

                    {/* Round navigation */}
                    <div className="flex gap-3 py-2 border-t-2 w-full justify-center">
                        <Button
                            className="text-xs sm:text-sm lg:text-md py-2 lg:py-5 cursor-pointer"
                            variant="outline"
                            disabled={matchPointsData.set_number <= 1}
                            onClick={() => changeRound(matchPointsData.set_number - 1)}
                        >
                            <ChevronLeft className="h-4 w-4 mr-1" />
                            Prev
                        </Button>
                        <Button
                            className="text-xs sm:text-sm lg:text-md py-2 lg:py-5 cursor-pointer"
                            variant="outline"
                            disabled={matchPointsData.set_number >= maxSets}
                            onClick={() => changeRound(matchPointsData.set_number + 1)}
                        >
                            Next
                            <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                    </div>

                    {/* Timer controls */}
                    {sportData?.timeperset && (
                        <div className="flex flex-col gap-3 w-[120px] md:w-[180px] lg:w-[220px] pb-3">
                            <Button
                                className="text-xs sm:text-sm lg:text-md py-2 lg:py-5 cursor-pointer"
                                variant={isRunning ? "destructive" : "default"}
                                onClick={() => setIsRunning(!isRunning)}
                            >
                                {isRunning ? "Pause" : "Start"}
                            </Button>
                            <Button
                                className="text-xs sm:text-sm lg:text-md py-2 lg:py-5 cursor-pointer"
                                variant="destructive"
                                onClick={() => {
                                    setMatchPointsData((prev) => ({ ...prev, time: 0 }));
                                    setIsRunning(false);
                                }}
                            >
                                Reset timer
                            </Button>
                        </div>
                    )}
                </div>

                {/* ── Side B ─── */}
                <div className="flex flex-col items-center justify-center gap-6 bg-red-50/60 text-red-900 border-l-2">
                    <p className="text-lg text-center pt-4 drop-shadow-sm">
                        {participantB ?? "Side B"}
                    </p>
                    <p className="text-7xl lg:text-9xl my-auto font-bold">
                        {matchPointsData.team_b_score}
                    </p>
                    {isArnis ? (
                        <div className="grid grid-cols-3 w-full">
                            <div className="flex-col flex items-center justify-center gap-3 py-3 bg-white w-full border-2">
                                <p className="font-medium border-b-2 text-center w-full pb-2 text-md md:text-sm">Regular Penalty</p>
                                <p className="text-3xl lg:text-5xl font-bold">{regularPenaltyB}</p>
                            </div>
                            <div className="flex-col flex items-center justify-center gap-3 py-3 bg-white w-full border-2">
                                <p className="font-medium border-b-2 text-center w-full pb-2 text-md md:text-sm">Penalty</p>
                                <p className="text-3xl lg:text-5xl font-bold">{minusPenaltyB}</p>
                            </div>
                            <div className="flex-col flex items-center justify-center gap-3 py-3 bg-white w-full border-2">
                                <p className="font-semibold border-b-2 text-center w-full pb-2 text-md md:text-sm">WIN</p>
                                <p className="text-3xl lg:text-5xl font-bold">{matchPointsData.b_wins}</p>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 w-full">
                            <div className="flex-col flex items-center justify-center gap-3 py-3 bg-white w-full border-1">
                                <p className="text-lg font-semibold border-b-2 text-center w-full pb-2">WIN</p>
                                <p className="text-3xl lg:text-6xl font-bold">{matchPointsData.b_wins}</p>
                            </div>
                            <div className="flex-col flex items-center justify-center gap-3 py-3 bg-white w-full border-1">
                                <p className="text-lg font-semibold border-b-2 text-center w-full pb-2">Penalty</p>
                                <p className="text-3xl lg:text-6xl font-bold">{regularPenaltyB}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* ── Scoring buttons ────────────────────────────────── */}
            <div className="grid grid-cols-3">
                {/* Side A buttons */}
                <div className="grid">
                    <SportPoints
                        scoringPoints={scoringPoints}
                        penalties={penalties}
                        teamScore={matchPointsData.team_a_score}
                        matchPointsData={matchPointsData}
                        handleTableScoreChange={handleTableScoreChange}
                        minusPenalty={minusPenaltyA}
                        changeMinusPenalty={changeMinusPenaltyA}
                        regularPenalty={regularPenaltyA}
                        changeRegularPenalty={changeRegularPenaltyA}
                        resetScoringState={resetScoringState}
                        sportData={sportData}

                        team_type="a"
                    />
                </div>

                {/* Center reset buttons */}
                <div className="flex mx-auto gap-3 w-fit items-center">
                    <Button
                        className="text-xs md:text-sm lg:text-md py-2 lg:py-5 cursor-pointer"
                        variant="outline"
                        onClick={() => {
                            handleTableScoreChange(matchPointsData.set_number, "a", 0);
                            setMatchPointsData((prev) => ({ ...prev, team_a_score: 0 }));
                            changeRegularPenaltyA(0);
                            changeMinusPenaltyA(0);
                        }}
                    >
                        Reset
                    </Button>

                    {!isArnis && (
                        <Button className="text-xs md:text-sm lg:text-md py-2 lg:py-5 cursor-pointer" variant="outline">
                            Penalty
                        </Button>
                    )}

                    <Button
                        className="text-xs md:text-sm lg:text-md py-2 lg:py-5 cursor-pointer"
                        variant="outline"
                        onClick={() => {
                            handleTableScoreChange(matchPointsData.set_number, "b", 0);
                            setMatchPointsData((prev) => ({ ...prev, team_b_score: 0 }));
                            changeRegularPenaltyB(0);
                            changeMinusPenaltyB(0);
                        }}
                    >
                        Reset
                    </Button>
                </div>

                {/* Side B buttons */}
                <SportPoints
                    scoringPoints={scoringPoints}
                    penalties={penalties}
                    teamScore={matchPointsData.team_b_score}
                    matchPointsData={matchPointsData}
                    handleTableScoreChange={handleTableScoreChange}
                    minusPenalty={minusPenaltyB}
                    changeMinusPenalty={changeMinusPenaltyB}
                    regularPenalty={regularPenaltyB}
                    changeRegularPenalty={changeRegularPenaltyB}
                    resetScoringState={resetScoringState}
                    sportData={sportData}
                    team_type="b"
                />
            </div>
        </main>

        <Separator />

        {/* ── Table ──────────────────────────────── */}

        {matchInformation && (
            <div className="border overflow-hidden rounded-lg">
                <Table>
                    <TableHeader className="bg-muted">
                        <TableRow>
                            <TableHead className="w-[60px]">{setOrRound}</TableHead>
                            <TableHead>{participantA ?? "Side A"} Score</TableHead>
                            <TableHead>{participantB ?? "Side B"} Score</TableHead>
                            <TableHead className="w-[80px]">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {createPointsData().map((row) => (
                            <TableRow
                                key={row.set_number}
                                className={row.isActive ? "bg-accent/50" : ""}
                            >
                                <TableCell className="font-medium">{row.set_number}</TableCell>
                                <TableCell>
                                    <EditableValueInput
                                        className="w-20 h-8"
                                        value={row.isActive ? matchPointsData.team_a_score : row.a_score}
                                        onSave={(val) => handleTableScoreChange(row.set_number, "a", val)}
                                    />
                                </TableCell>
                                <TableCell>
                                    <EditableValueInput
                                        className="w-20 h-8"
                                        value={row.isActive ? matchPointsData.team_b_score : row.b_score}
                                        onSave={(val) => handleTableScoreChange(row.set_number, "b", val)}
                                    />
                                </TableCell>
                                <TableCell>
                                    {!row.isActive && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => jumpToRound(row.set_number)}
                                        >
                                            Go
                                        </Button>
                                    )}
                                    {row.isActive && (
                                        <span className="text-xs font-semibold bg-green-100 text-green-700 rounded-full px-2 py-1">Active</span>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        )}


        {isTeamMatch && (
            <>
                <Separator />
                <ScoreboardPlayerTable
                    sportData={sportData}
                    matchData={matchInformation}
                    isTeamMatch={isTeamMatch}
                    team_a_players={team_a_players}
                    team_b_players={team_b_players}
                    participantA={participantA}
                    participantB={participantB}
                />
            </>
        )}
    </>
}


