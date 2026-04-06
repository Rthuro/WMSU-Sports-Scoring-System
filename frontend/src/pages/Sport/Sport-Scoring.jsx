import { useParams, useNavigate, useSearchParams } from "react-router-dom"
import { PageSync } from "@/components/custom/PageSync";
import { useMatchStore, useMatchPointsStore } from "@/store/useMatchStore";
import { useEffect, useState, useRef  } from "react";
import { ArrowLeft, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useTournamentMatchStore } from "@/store/useTournamentStore2";
import { useSportsStore } from "@/store/useSportsStore";
import { useTeamStore } from '@/store/useTeamStore';
import { SportPoints } from "@/components/custom/sport-points";
import { getTimeStringForDB, getTimeInSeconds } from "@/lib/helpers";
import { Table, TableBody, TableCell, TableHeader, TableRow, TableHead } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useTournamentTallyStore } from "@/store/useTournamentStore2";

export function SportScoring () {
    const navigate = useNavigate();
    const  { sport } = useParams();

    const { matches, fetchMatches } = useMatchStore();
    const { updateMatchPoint, addMatchPoint, resetMatchPoints, fetchAllMatchPoints, matchPoints, allMatchPoints, fetchMatchPoints } = useMatchPointsStore();
    const { match, fetchMatch, fetchTournamentById, updateTournamentMatch } = useTournamentMatchStore();
    const { sports, fetchPenalties, penalties, fetchScoringPoints, scoringPoints, fetchSportById, fetchSports } = useSportsStore();
    const { teamsBySport, fetchTeamsBySport } = useTeamStore();
    const {tally,  updateTournamentTally } = useTournamentTallyStore();

    const [searchParams] = useSearchParams();
    const matchId = searchParams.get("m-id");
    const tournamentMatchId = searchParams.get("tm-id");

    useEffect(() => {
        fetchSports()
        fetchMatches();
        fetchAllMatchPoints();
    }, [fetchMatches, fetchSports, fetchAllMatchPoints]);
      
    useEffect(() => {
        const sportData = sports.find((s) => s.name.toLowerCase() === sport?.toLowerCase());
        if (sportData) {
            fetchTeamsBySport(sportData.sport_id);
            fetchSportById(sportData.sport_id);
        }
    }, [sports, sport, fetchTeamsBySport, fetchSportById]);

    useEffect(() => {
        if (tournamentMatchId) {
            fetchMatch(tournamentMatchId);
        }
    }, [ tournamentMatchId, fetchMatch ]);

    let matchInformation = null;

    if(matchId){
        matchInformation = matches.find((m) => m.match_id === matchId);
    }

    if(tournamentMatchId){
        matchInformation = match;
    }

    useEffect(() => {
        if(matchInformation){
            fetchMatchPoints(matchInformation?.match_id);
        }
    }, [matchInformation, fetchMatchPoints]);


    const sportData = sports.find((s) => s.name.toLowerCase() === sport?.toLowerCase());

    useEffect(() => {
        if(sportData?.sport_id){
            fetchPenalties(sportData?.sport_id);
            fetchScoringPoints(sportData?.sport_id);
        }
        
    }, [ fetchPenalties, sportData?.sport_id, fetchScoringPoints]);

    const teamA = teamsBySport.find( t=> t.team_id === matchInformation?.team_a_id)?.name;
    const teamB = teamsBySport.find( t=> t.team_id === matchInformation?.team_b_id)?.name;

    
    const createPointsData = () => {
        const pointsData = [];
        for(let i = 1; i <= sportData?.max_sets; i++) {
            const match = matchPoints?.find(mp => mp.team_a_id === matchInformation?.team_a_id
                && mp.team_b_id === matchInformation?.team_b_id && mp.set_number === i);

            pointsData.push({
                team_a: teamA,
                team_b: teamB,
                set_number: i,
                team_a_score: match?.a_score || 0,
                team_b_score: match?.b_score || 0
            });
        }
        return pointsData;
    }

    const addTeamMatchPoint = async (match_id, team_a_id, team_b_id, player_a_id, player_b_id, a_score, b_score, set_number, time) => {
            await addMatchPoint({
                match_id: match_id,
                team_a_id: team_a_id,
                team_b_id: team_b_id,
                player_a_id: player_a_id,
                player_b_id: player_b_id,
                a_score: a_score || 0,
                b_score: b_score || 0,
                set_number: set_number,
                time: time || null,
            });
     }
    const updateTeamMatchPoint = async (entry_id, match_id, team_a_id, team_b_id, player_a_id, player_b_id, a_score, b_score, set_number, time) => {
            await updateMatchPoint({
                entry_id: entry_id,
                match_id: match_id,
                team_a_id: team_a_id,
                team_b_id: team_b_id,
                player_a_id: player_a_id,
                player_b_id: player_b_id,
                a_score: a_score || 0,
                b_score: b_score || 0,
                set_number: set_number,
                time: time || null,
            });
     }

    const findTeamMatchInfo = (team_a, team_b, set_number) => {
        return matchPoints?.find((m) => m.team_a_id === team_a &&  m.team_b_id === team_b && m.set_number === set_number) || null;
    }
    // const teamAMatchInfo = findMatch?.find((m) => m.team_id === matchInformation?.team_a_id 
    //     && m.set_number === findMatch[0]?.set_number) || null;
    // const teamBMatchInfo = findMatch?.find((m) => m.team_id === matchInformation?.team_b_id 
    //     && m.set_number === findMatch[0]?.set_number) || null;
    
    // const teamAMatchInfoRef = useRef(null);
    // const teamBMatchInfoRef = useRef(null);

    const [matchPointsData, setMatchPointsData] = useState({
        set_number: 1,
        team_a_score: 0,
        team_b_score:  0,
        time:  0
    });
    

    useEffect(() => {
        if (matchInformation) {
            const matchPointInfo = matchPoints?.find((m) => m.team_a_id === matchInformation?.team_a_id &&  m.team_b_id === matchInformation?.team_b_id && m.set_number === matchPoints[0]?.set_number ) || null;

            setMatchPointsData({
                set_number: matchPointInfo?.set_number || 1,
                team_a_score: matchPointInfo?.a_score || 0,
                team_b_score: matchPointInfo?.b_score || 0,
                time: getTimeInSeconds(matchPoints[0]?.time) || 0
            });
        }

    }, [matchInformation, matchPoints]);
    

    // Penalty with no minus points
    const [ regularPenaltyA,   changeRegularPenaltyA] = useState(0);
    const [ regularPenaltyB,   changeRegularPenaltyB] = useState(0);

    // Penalty with minus points
    const [ minusPenaltyA,   changeMinusPenaltyA] = useState(0);
    const [ minusPenaltyB,   changeMinusPenaltyB] = useState(0);


    const [ winner, setWinner ] = useState({
        teamA: 0,
        teamB: 0
    })

    const formatTime = (ms) => {
        const minutes = String(Math.floor(ms / 60000)).padStart(2, "0");
        const seconds = String(Math.floor((ms % 60000) / 1000)).padStart(2, "0");
        const milliseconds = String(Math.floor((ms % 1000) / 10)).padStart(2, "0");

        return `${minutes}:${seconds}.${milliseconds}`;
    };
   
    const [isRunning, setIsRunning] = useState(false);


    const timerRef = useRef(null);

    useEffect(() => {
        if (isRunning) {
            timerRef.current = setInterval(() => {
                setMatchPointsData( prev => ({  
                    ...prev,
                    time: prev.time + 10
                }));
            }, 10);
        } else {
            clearInterval(timerRef.current);
        }
        return () => clearInterval(timerRef.current);
    }, [isRunning, matchPointsData]);
    
    const [showWinnerModal, setShowWinnerModal] = useState(false);
    const [winnerName, setWinnerName] = useState("");

    function addPoints(){
        const matchPointInfo = findTeamMatchInfo(matchInformation?.team_a_id, matchInformation?.team_b_id, matchPointsData.set_number);

        if (matchPointInfo) {
            if (
                matchPointsData.team_a_score !== matchPointInfo?.a_score ||
                matchPointsData.team_b_score !== matchPointInfo?.b_score
            ) {
                updateTeamMatchPoint(matchPointInfo?.entry_id, matchInformation?.match_id, matchInformation?.team_a_id,  matchInformation?.team_b_id, null, null,matchPointsData.team_a_score, matchPointsData.team_b_score, matchPointsData.set_number, getTimeStringForDB(matchPointsData.time));
                
            }
        } else {
            // Set doesn't exist yet, create new records for both teams
           addTeamMatchPoint( matchInformation?.match_id, matchInformation?.team_a_id,  matchInformation?.team_b_id, null, null,matchPointsData.team_a_score, matchPointsData.team_b_score, matchPointsData.set_number, getTimeStringForDB(matchPointsData.time));

        }
       
    }

    const resetScoringState = async () => {

        if( matchPointsData.set_number !== sportData?.default_sets) {
            addPoints();

            setMatchPointsData( prev => ({
                set_number: prev?.set_number + 1,
                team_a_score: 0,
                team_b_score: 0,
                time: 0
            }));

            setWinner({
                teamA: matchPointsData.team_a_score > matchPointsData.team_b_score ? winner.teamA + 1 : winner.teamA,
                teamB: matchPointsData.team_b_score > matchPointsData.team_a_score ? winner.teamB + 1 : winner.teamB
            });
            
        }


        if(matchPointsData.set_number === sportData?.default_sets){
            setWinnerName(matchPointsData.team_a_score >  matchPointsData.team_b_score ? teamA : teamB);
            setShowWinnerModal(true);
            const teamAtallyData = tally.find(t => t.tournament_id === matchInformation?.tournament_id && t.team_id === matchInformation?.team_a_id);

            const teamBtallyData = tally.find(t => t.tournament_id === matchInformation?.tournament_id && t.team_id === matchInformation?.team_a_id);
            
            await updateTournamentTally(matchInformation?.tournament_id, matchInformation?.team_a_id, {
                wins: matchPointsData.team_a_score >  matchPointsData.team_b_score ? 
                (teamAtallyData?.wins || 0) + 1 : 
                (teamAtallyData?.wins || 0),

                losses: matchPointsData.team_a_score <  matchPointsData.team_b_score ? 
                (teamAtallyData?.losses || 0) + 1 : 
                (teamAtallyData?.losses || 0)
            })

            await updateTournamentTally(matchInformation?.tournament_id, matchInformation?.team_b_id,{
                wins: matchPointsData.team_a_score < matchPointsData.team_b_score ? 
                (teamBtallyData?.wins || 0) + 1 : 
                (teamBtallyData?.wins || 0),

                losses: matchPointsData.team_a_score > matchPointsData.team_b_score ? 
                (teamBtallyData?.losses || 0) + 1 : 
                (teamBtallyData?.losses || 0)
            });

            await updateTournamentMatch(matchInformation?.match_id, {
                round: matchInformation?.round + 1,
                is_finished: true,
            });

            addPoints();
        }
        
    }
    

    const handleBackButtonClick = async () => {
        const matchPointInfo = findTeamMatchInfo(matchInformation?.team_a_id, matchInformation?.team_b_id, matchPointsData.set_number) || null;

        if (matchPointInfo !== null) {
            if (
                matchPointsData.team_a_score !== matchPointInfo?.a_score ||
                matchPointsData.team_b_score !== matchPointInfo?.b_score
            ) {
                updateTeamMatchPoint(matchPointInfo?.entry_id, matchInformation?.match_id, matchInformation?.team_a_id, matchInformation?.team_b_id, null, null, matchPointsData.team_a_score, matchPointsData.team_b_score, matchPointsData.set_number,  getTimeStringForDB(matchPointsData.time));
            }
        } else {

            // Set doesn't exist yet, create new records for both teams
            addTeamMatchPoint(matchInformation?.match_id, matchInformation?.team_a_id, matchInformation?.team_b_id, null, null, matchPointsData.team_a_score, matchPointsData.team_b_score, matchPointsData.set_number,  getTimeStringForDB(matchPointsData.time));
        }
        navigate(-1);

        await fetchAllMatchPoints();
        await fetchMatch(tournamentMatchId);
    }

    return <>
        <Dialog open={showWinnerModal} onOpenChange={setShowWinnerModal}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Match Winner!</DialogTitle>
                </DialogHeader>
                <div className="text-center py-4">
                    <p className="text-xl font-bold">{winnerName}</p>
                    <p className="mt-2">is the winner of this tournament match!</p>
                </div>
                <DialogFooter className="grid grid-cols-2 gap-4">
                    <Button onClick={() => setShowWinnerModal(false)}>Close</Button>
                    <Button onClick={() => navigate(-1)}>Exit</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>

        <PageSync page={ matchInformation?.match_name || "Quick Scoring"} />
        <div className="flex items-center justify-between">
            <div className="flex item-center gap-3">
                <button  onClick={handleBackButtonClick} className="cursor-pointer" ><ArrowLeft /></button>
                
            </div>
            <div className="flex item-center gap-3">
                <Button className="text-xs bg-green-700 hover:bg-green-600  text-white md:text-sm lg:text-md py-2 lg:py-5 cursor-pointer" variant="default">Edit Match</Button>
            </div>
        </div>
        <main className="flex flex-col gap-6 mt-3 mb-6">
                <div className="grid grid-cols-3 min-h-[300px] sm:max-h-auto border-2 ">
                    <div className="flex flex-col items-center gap-6 bg-blue-50/60 text-blue-900 border-r-2">
                        <p className="text-lg text-center text-wrap pt-4 drop-shadow-sm drop-shadow-white">
                            {teamA ? teamA: "Team A"}
                        </p>
                        <p className="text-7xl lg:text-9xl my-auto font-bold">
                            {matchPointsData.team_a_score}
                        </p>

                        {sport.toLocaleLowerCase() == 'arnis' ? (
                            <div className="grid grid-cols-3 w-full">
                                <div className="flex-col flex items-center justify-center gap-3 py-3 bg-white w-full border-y-2 border-x ">
                                    <p className=" font-medium border-b-2 text-center w-full pb-2  text-md md:text-sm">Regular Penalty</p>
                                    <p className="text-3xl lg:text-5xl font-bold">{regularPenaltyA}</p>
                                </div>
                                <div className="flex-col flex items-center justify-center gap-3 py-3 bg-white w-full border-2 ">
                                    <p className=" font-medium border-b-2 text-center w-full pb-2  text-md md:text-sm">Penalty</p>
                                    <p className="text-3xl lg:text-5xl font-bold">{minusPenaltyA}</p>
                                </div>
                                <div className="flex-col flex items-center justify-center gap-3 py-3 bg-white w-full border-2 ">
                                    <p className=" font-semibold border-b-2 text-center w-full pb-2 border-blue-50 text-md md:text-sm">WIN</p>
                                    <p className="text-3xl lg:text-5xl font-bold">{winner.teamA}</p>
                                </div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 w-full">
                                <div className="flex-col flex items-center justify-center gap-3 py-3 bg-white w-full border-1 ">
                                    <p className="text-lg font-semibold border-b-2   text-center w-full pb-2 ">WIN</p>
                                    <p className="text-3xl lg:text-6xl font-bold">{winner.teamA}</p>
                                </div>
                                <div className="flex-col flex items-center justify-center gap-3 py-3 bg-white w-full border-1 ">
                                    <p className="text-lg font-semibold border-b-2 text-center w-full pb-2 ">Penalty</p>
                                    <p className="text-3xl lg:text-6xl font-bold">{regularPenaltyA}</p>
                                </div>
                            </div>
                           
                        )}
                        
                    </div>
                <div className="flex flex-col items-center gap-6 ">
                {sportData?.timeperset && (
                    <p className="text-center text-3xl lg:text-6xl font-semibold pt-6 w-full">
                        {formatTime(matchPointsData.time || 0)}
                    </p>
                )}
                <div className="flex flex-col items-center bg-zinc-900 w-full flex-1">
                    <p className="text-center font-bold w-full py-3 text-white">
                        {sportData?.use_set_based_scoring ? "Set": "Round"}
                    </p>
                    <p className="flex items-center justify-center text-4xl lg:text-5xl font-semibold py-6 bg-white w-full h-full"> 
                        {matchPointsData.set_number}
                    </p>
                </div>

                <div className="flex gap-3 py-4 border-t-2 w-full justify-center">
                    <Button className="text-xs sm:text-sm lg:text-md py-2 lg:py-5 cursor-pointer" variant="outline" onClick={ () => { 
                        if(matchPointsData.set_number == sportData?.default_sets) {
                           setMatchPointsData( prev => ({
                                ...prev,
                                set_number: sportData?.default_sets
                            }))
                        } else {
                            setMatchPointsData( prev => ({
                                ...prev,
                                set_number: prev.set_number + 1
                            }))
                        }
                        } }>
                        + Round
                    </Button>
                    <Button className="text-xs sm:text-sm lg:text-md py-2 lg:py-5 cursor-pointer" variant="destructive" onClick={ () => { 
                        matchPointsData.set_number == 0 && setMatchPointsData( prev => ({
                                ...prev,
                                set_number: prev.set_number - 1
                            }))
                    } }>
                        - Round
                    </Button>
                </div>
                
                 {sportData?.timeperset && (
                    <div className="flex flex-col gap-3 w-[120px] md:w-[180px] lg:w-[220px] pb-3 ">
                        <Button className="text-xs sm:text-sm lg:text-md py-2 lg:py-5 cursor-pointer" variant={isRunning ? "destructive" : "default"} onClick={() => setIsRunning(!isRunning)}>
                            {isRunning ? "Pause" : "Start"}
                        </Button>
                        <Button className="text-xs sm:text-sm lg:text-md py-2 lg:py-5 cursor-pointer" variant="destructive" onClick={ () => {
                            setMatchPointsData({
                                ...matchPointsData,
                                time: 0
                            });
                            setIsRunning(false);} }>
                            Reset timer
                        </Button>
                    </div>
                )}
                
                
                </div>
                <div className="flex flex-col items-center justify-center gap-6  bg-red-50/60 text-red-900 border-l-2">
                    <p className="text-lg text-center pt-4  drop-shadow-sm drop-shadow-white ">
                        {teamB ? teamB: "Team B"}
                    </p>
                    <p className="text-7xl lg:text-9xl my-auto font-bold">
                        {matchPointsData.team_b_score}
                    </p>
                    {sport.toLocaleLowerCase() == 'arnis' ? (
                            <div className="grid grid-cols-3 w-full ">
                                <div className="flex-col flex items-center justify-center gap-3 py-3 bg-white w-full border-2 ">
                                    <p className=" font-medium border-b-2 text-center w-full pb-2  text-md md:text-sm">Regular Penalty</p>
                                    <p className="text-3xl lg:text-5xl font-bold">{regularPenaltyB}</p>
                                </div>
                                <div className="flex-col flex items-center justify-center gap-3 py-3 bg-white w-full border-2 ">
                                    <p className=" font-medium border-b-2 text-center w-full pb-2  text-md md:text-sm">Penalty</p>
                                    <p className="text-3xl lg:text-5xl font-bold">{minusPenaltyB}</p>
                                </div>
                                <div className="flex-col flex items-center justify-center gap-3 py-3 bg-white w-full border-2 ">
                                    <p className=" font-semibold border-b-2 text-center w-full pb-2  text-md md:text-sm">WIN</p>
                                    <p className="text-3xl lg:text-5xl font-bold">{winner.teamB}</p>
                                </div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 w-full">
                                <div className="flex-col flex items-center justify-center gap-3 py-3 bg-white w-full border-1 ">
                                    <p className="text-lg font-semibold border-b-2 text-center w-full pb-2 ">WIN</p>
                                    <p className="text-3xl lg:text-6xl font-bold">{winner.teamB}</p>
                                </div>
                                <div className="flex-col flex items-center justify-center gap-3 py-3 bg-white w-full border-1 ">
                                    <p className="text-lg font-semibold border-b-2 text-center w-full pb-2 ">Penalty</p>
                                    <p className="text-3xl lg:text-6xl font-bold">{regularPenaltyB}</p>
                                </div>
                            </div>
                           
                        )}
                </div>
            </div>

            
            {/* SCORE POINTS */}
            <div className="grid grid-cols-3 ">
               {/* Team A */}
            <div className="grid">
                 <SportPoints scoringPoints={scoringPoints} penalties={penalties} teamScore={matchPointsData.team_a_score} matchPointsData={matchPointsData} setMatchPointsData={setMatchPointsData} minusPenalty={minusPenaltyA} changeMinusPenalty={changeMinusPenaltyA} regularPenalty={regularPenaltyA} changeRegularPenalty={changeRegularPenaltyA} resetScoringState={resetScoringState} maxScore={sportData?.max_score} team="team_a_score"/>
            </div>
              
               <div className="flex mx-auto gap-3 w-fit items-center">
                        {/* Team A */}
                        <Button className="text-xs md:text-sm lg:text-md py-2 lg:py-5 cursor-pointer" variant="outline" onClick={ () => {
                            setMatchPointsData({
                                ...matchPointsData,
                                team_a_score: 0,
                            })
                            changeRegularPenaltyA(0)
                            changeMinusPenaltyA(0)
                        }}
                        >Reset</Button>

                        { sport.toLocaleLowerCase() != 'arnis' && (
                            <Button className="text-xs md:text-sm lg:text-md py-2 lg:py-5 cursor-pointer" variant="outline">
                                Penalty
                            </Button>
                        )}
                        

                        {/* Team B */}
                        <Button className="text-xs md:text-sm lg:text-md py-2 lg:py-5 cursor-pointer" variant="outline"
                        onClick={ () => {
                            setMatchPointsData({
                                ...matchPointsData,
                                team_b_score: 0,
                            })
                            changeRegularPenaltyB(0)
                            changeMinusPenaltyB(0)
                        }}
                        >Reset</Button>
                </div>

                 {/* Team B */}

                <SportPoints scoringPoints={scoringPoints} penalties={penalties} teamScore={matchPointsData.team_b_score}  matchPointsData={matchPointsData} setMatchPointsData={setMatchPointsData} minusPenalty={minusPenaltyB} changeMinusPenalty={changeMinusPenaltyB} regularPenalty={regularPenaltyB} changeRegularPenalty={changeRegularPenaltyB} resetScoringState={resetScoringState} maxScore={sportData?.max_score} team="team_b_score"/>
            </div>
        </main>
        
        {/* { data && (
            <div className="flex flex-col gap-6 mt-6">
                <MatchPlayerStats team="teamA" data={data} />
                <MatchPlayerStats team="teamB"  data={data} />
            </div>
        )} */}
        
        <div className="border overflow-hidden rounded-lg">
            <Table >
                <TableHeader  className="bg-muted">
                    <TableRow>
                        <TableHead> Team A</TableHead>
                        <TableHead> Team B</TableHead>
                        <TableHead> Set</TableHead>
                        <TableHead> Team A Score </TableHead>
                        <TableHead> Team B Score </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    { createPointsData()?.map( (m, idx) => (
                        <TableRow key={idx}>
                            <TableCell>
                                {m.team_a}
                            </TableCell>
                            <TableCell>
                                {m.team_b}
                            </TableCell>
                            <TableCell>
                                {m.set_number}
                            </TableCell>
                            <TableCell>
                                { m.team_a_score}
                            </TableCell>
                            <TableCell>
                                { m.team_b_score }
                            </TableCell>
                        </TableRow>
                    )) }
                </TableBody>
            </Table>
        </div>
       
       

    </>
}
