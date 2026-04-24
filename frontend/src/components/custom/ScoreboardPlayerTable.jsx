import { UserRoundPen, TriangleAlert, Edit3, Trash, Plus, Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Table, TableBody, TableCell, TableHeader, TableRow, TableHead } from "../ui/table";
import { usePlayerStatsStore, usePlayerPenaltyStore } from "@/store/usePlayerStore";
import { useState, useEffect } from "react";
import { useSportsStore } from "@/store/useSportsStore";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "../ui/sheet";
import { Separator } from "../ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "../ui/dialog";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { toast } from "react-hot-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { EditableValueInput } from "./EditableValueInput";

export function ScoreboardPlayerTable({ sportData, matchData, isTeamMatch, team_a_players, team_b_players, participantA, participantB }) {
    const [openSheet, setOpenSheet] = useState(false);
    const [sheetType, setSheetType] = useState(null);

    // console.log("sportData", sportData);
    const [addDialogOpen, setAddDialogOpen] = useState(false);
    const [addDialogType, setAddDialogType] = useState("");

    const [addPlayerStatDialogOpen, setAddPlayerStatDialogOpen] = useState(false);
    const [addPlayerStatDialogType, setAddPlayerStatDialogType] = useState("");
    const [teamPlayers, setTeamPlayers] = useState([]);

    const [displayTeamA, setDisplayTeamA] = useState([]);
    const [displayTeamB, setDisplayTeamB] = useState([]);

    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [editDialogType, setEditDialogType] = useState("");
    const [editData, setEditData] = useState(null);

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deleteDialogType, setDeleteDialogType] = useState("");
    const [deleteDialogLoader, setDeleteDialogLoader] = useState(false);
    const [deleteDialogId, setDeleteDialogId] = useState(null);

    const [deletePlayerDialogOpen, setDeletePlayerDialogOpen] = useState(false);
    const [deleteDialogEntryId, setDeleteDialogEntryId] = useState(null);

    const { addPlayerStats, updatePlayerStats, playerStatsByMatch, fetchPlayerStatsByMatch, deletePlayerStats } = usePlayerStatsStore();

    const { playerPenaltiesByMatch, addPlayerPenalties, updatePlayerPenalties, fetchPlayerPenaltiesByMatch, deletePlayerPenalties } = usePlayerPenaltyStore();

    const { addStat, updateStat, addPenalties, updatePenalties, fetchStatsBySportId, sportStats, fetchPenalties, penalties, deleteStat, deletePenalties } = useSportsStore();

    useEffect(() => {
        fetchPlayerStatsByMatch(matchData.match_id)
        fetchPlayerPenaltiesByMatch(matchData.match_id)

        if (openSheet && sheetType === "stats") {
            fetchStatsBySportId(sportData?.sport_id)
        } else if (openSheet && sheetType === "penalties") {
            fetchPenalties(sportData?.sport_id)
        }
        setDisplayTeamA(team_a_players)
        setDisplayTeamB(team_b_players)
    }, [openSheet]);

    const handleDeleteDialogSubmit = async () => {
        setDeleteDialogLoader(true);
        if (deleteDialogType === "stats") {
            try {
                const res = await deleteStat(deleteDialogId);
                if (res) {
                    setDeleteDialogOpen(false);
                    setDeleteDialogType("");
                    fetchStatsBySportId(sportData?.sport_id)
                }
            } catch (error) {
                console.error(error);
                toast.error("An error occurred");
            } finally {
                setDeleteDialogLoader(false);
            }
        } else {
            try {
                const res = await deletePenalties(deleteDialogId);
                if (res) {
                    setDeleteDialogOpen(false);
                    setDeleteDialogType("");
                    fetchPlayerPenaltiesByMatch(matchData.match_id)
                }
            } catch (error) {
                console.error(error);
                toast.error("An error occurred");
            } finally {
                setDeleteDialogLoader(false);
            }
        }
    };


    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-center self-end gap-2">
                <Button variant="outline" onClick={() => {
                    setSheetType("stats")
                    setOpenSheet(true)
                }}>
                    <UserRoundPen className="w-4 h-4" />
                    Update Player Stats
                </Button>
                <Button onClick={() => {
                    setSheetType("penalties")
                    setOpenSheet(true)
                }}>
                    <TriangleAlert className="w-4 h-4" />
                    Update Player Penalties
                </Button>
            </div>

            <>
                <p className="text-xl font-bold mt-2">{participantA} Players</p>
                <div className="border overflow-hidden rounded-lg">
                    <Table>
                        <TableHeader className="bg-muted">
                            <TableRow>
                                <TableHead>Jersy #</TableHead>
                                <TableHead>Player Name</TableHead>
                                <TableHead>Stat Points</TableHead>
                                <TableHead>Penalty Points</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {formatPlayerStats(team_a_players(), playerStatsByMatch, playerPenaltiesByMatch).map((player) => (
                                <TableRow key={player.player_id}>
                                    <TableCell>{player.jersy_number}</TableCell>
                                    <TableCell>
                                        {player.first_name + " "}
                                        {player.last_name}
                                    </TableCell>
                                    <TableCell>
                                        {player.stat_points}
                                    </TableCell>
                                    <TableCell>
                                        {player.penalty_points}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
                <p className="text-xl font-bold mt-2">{participantB} Players</p>
                <div className="border overflow-hidden rounded-lg">
                    <Table>
                        <TableHeader className="bg-muted">
                            <TableRow>
                                <TableHead>Jersy #</TableHead>
                                <TableHead>Player Name</TableHead>
                                <TableHead>Stat Points</TableHead>
                                <TableHead>Penalty Points</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {formatPlayerStats(team_b_players(), playerStatsByMatch, playerPenaltiesByMatch).map((player) => (
                                <TableRow key={player.player_id}>
                                    <TableCell>{player.jersy_number}</TableCell>
                                    <TableCell>
                                        {player.first_name + " "}
                                        {player.last_name}
                                    </TableCell>
                                    <TableCell>
                                        {player.stat_points}
                                    </TableCell>
                                    <TableCell>
                                        {player.penalty_points}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </>

            {sheetType === "stats" ? (
                <Sheet open={openSheet && sheetType === "stats"} onOpenChange={setOpenSheet}>
                    <SheetContent className="min-w-[650px] overflow-y-auto pb-4">
                        <SheetHeader>
                            <SheetTitle>
                                Update Player Stats
                            </SheetTitle>
                            <SheetDescription>
                                <p className="text-sm text-muted-foreground">
                                    Add or update player and sport stats
                                </p>
                            </SheetDescription>
                        </SheetHeader>

                        <div className="flex flex-col gap-4 px-4">
                            <Button variant="outline" onClick={() => {
                                setAddDialogOpen(true)
                                setAddDialogType("stats")
                            }}>
                                <Plus />
                                Add Sport Stat
                            </Button>

                            <div className="border rounded-lg ">
                                <Table>
                                    <TableHeader className="bg-muted">
                                        <TableRow>
                                            <TableHead>Stats</TableHead>
                                            <TableHead>Is player stats</TableHead>
                                            <TableHead>Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {sportStats ? sportStats?.map((stat) => (
                                            <TableRow key={stat.stats_id}>
                                                <TableCell>{stat.stats_name}</TableCell>
                                                <TableCell>{stat.is_player_stat ? "Yes" : "No"}</TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <Button size="sm" variant="outline"
                                                            onClick={() => {
                                                                setEditDialogOpen(true)
                                                                setEditDialogType("stats")
                                                                setEditData(stat)
                                                            }}>
                                                            <Edit3 />
                                                        </Button>
                                                        <Button size="sm" onClick={() => {
                                                            setDeleteDialogOpen(true)
                                                            setDeleteDialogType("stats")
                                                            setDeleteDialogId(stat.stats_id)
                                                        }}
                                                            className="bg-destructive">
                                                            <Trash />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        )) : (
                                            <TableRow>
                                                <TableCell>No stats found</TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>

                            <Separator className="my-2" />

                            <div className="flex items-center justify-between">
                                <p className="text-lg font-semibold ">
                                    {participantA}
                                </p>
                                <Button variant="outline" size="sm"
                                    onClick={() => {
                                        setAddPlayerStatDialogOpen(true)
                                        setAddPlayerStatDialogType(sheetType)
                                        setTeamPlayers(team_a_players)
                                    }}
                                >
                                    <Plus />
                                    Add Player Stats
                                </Button>
                            </div>
                            <PlayerTable
                                sheetType={sheetType}
                                playerStatsByMatch={playerStatsByMatch}
                                playerPenaltiesByMatch={playerPenaltiesByMatch}
                                team={displayTeamA}
                                updatePlayerStats={updatePlayerStats}
                                updatePlayerPenalties={updatePlayerPenalties}
                                fetchMatchPlayerStats={fetchPlayerStatsByMatch}
                                fetchMatchPlayerPenalties={fetchPlayerPenaltiesByMatch}
                                matchId={matchData?.match_id}
                                setDeleteDialogEntryId={setDeleteDialogEntryId}
                                setDeleteDialogOpen={setDeletePlayerDialogOpen}
                            />

                            <Separator className="my-2" />

                            <div className="flex items-center justify-between">
                                <p className="text-lg font-semibold ">
                                    {participantB}
                                </p>
                                <Button variant="outline" size="sm"
                                    onClick={() => {
                                        setAddPlayerStatDialogOpen(true)
                                        setAddPlayerStatDialogType(sheetType)
                                        setTeamPlayers(team_b_players)
                                    }}
                                >
                                    <Plus />
                                    Add Player Stats
                                </Button>
                            </div>
                            <PlayerTable
                                sheetType={sheetType}
                                playerStatsByMatch={playerStatsByMatch}
                                playerPenaltiesByMatch={playerPenaltiesByMatch}
                                team={displayTeamB}
                                updatePlayerStats={updatePlayerStats}
                                updatePlayerPenalties={updatePlayerPenalties}
                                fetchMatchPlayerStats={fetchPlayerStatsByMatch}
                                fetchMatchPlayerPenalties={fetchPlayerPenaltiesByMatch}
                                matchId={matchData?.match_id}
                                setDeleteDialogEntryId={setDeleteDialogEntryId}
                                setDeleteDialogOpen={setDeletePlayerDialogOpen}
                            />
                        </div>
                    </SheetContent>
                </Sheet>
            ) : (
                <Sheet open={openSheet && sheetType === "penalties"} onOpenChange={setOpenSheet}>
                    <SheetContent className="min-w-[650px] overflow-y-auto pb-4">
                        <SheetHeader>
                            <SheetTitle>
                                Update Player Penalties
                            </SheetTitle>
                            <SheetDescription>
                                <p className="text-sm text-muted-foreground">
                                    Add or update player and sport penalties
                                </p>
                            </SheetDescription>
                        </SheetHeader>

                        <div className="flex flex-col gap-4 px-4">
                            <Button variant="outline" onClick={() => {
                                setAddDialogOpen(true)
                                setAddDialogType("penalties")
                            }}>
                                <Plus />
                                Add Sport Penalty
                            </Button>

                            <div className="border rounded-lg">
                                <Table>
                                    <TableHeader className="bg-muted">
                                        <TableRow>
                                            <TableHead>Penalty</TableHead>
                                            <TableHead>Description</TableHead>
                                            <TableHead>Points</TableHead>
                                            <TableHead>Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {penalties ? penalties?.map((penalty) => (
                                            <TableRow key={penalty.penalty_id}>
                                                <TableCell>{penalty.penalty_name}</TableCell>
                                                <TableCell>{penalty.description}</TableCell>
                                                <TableCell>{penalty.penalty_point}</TableCell>
                                                <TableCell >
                                                    <div className="flex items-center gap-2">
                                                        <Button size="sm" variant="outline"
                                                            onClick={() => {
                                                                setEditDialogOpen(true)
                                                                setEditDialogType("penalty")
                                                                setEditData(penalty)
                                                            }}>
                                                            <Edit3 />
                                                        </Button>
                                                        <Button size="sm"
                                                            className="bg-destructive"
                                                            onClick={() => {
                                                                setDeleteDialogOpen(true)
                                                                setDeleteDialogType("penalty")
                                                                setDeleteDialogId(penalty.penalty_id)
                                                            }}>
                                                            <Trash />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        )) : (
                                            <TableRow>
                                                <TableCell>No stats found</TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>

                            <Separator className="my-2" />

                            <div className="flex items-center justify-between">
                                <p className="text-lg font-semibold ">
                                    {participantA}
                                </p>
                                <Button variant="outline" size="sm"
                                    onClick={() => {
                                        setAddPlayerStatDialogOpen(true)
                                        setAddPlayerStatDialogType(sheetType)
                                        setTeamPlayers(team_a_players)
                                    }}
                                >
                                    <Plus />
                                    Add Player Penalties
                                </Button>
                            </div>

                            <PlayerTable
                                sheetType={sheetType}
                                playerStatsByMatch={playerStatsByMatch}
                                playerPenaltiesByMatch={playerPenaltiesByMatch}
                                team={displayTeamA}
                                updatePlayerStats={updatePlayerStats}
                                updatePlayerPenalties={updatePlayerPenalties}
                                fetchMatchPlayerStats={fetchPlayerStatsByMatch}
                                fetchMatchPlayerPenalties={fetchPlayerPenaltiesByMatch}
                                matchId={matchData?.match_id}
                                setDeleteDialogEntryId={setDeleteDialogEntryId}
                                setDeleteDialogOpen={setDeletePlayerDialogOpen}
                            />

                            <Separator className="my-2" />

                            <div className="flex items-center justify-between">
                                <p className="text-lg font-semibold ">
                                    {participantB}
                                </p>
                                <Button variant="outline" size="sm"
                                    onClick={() => {
                                        setAddPlayerStatDialogOpen(true)
                                        setAddPlayerStatDialogType(sheetType)
                                        setTeamPlayers(team_b_players)
                                    }}>
                                    <Plus />
                                    Add Player Penalties
                                </Button>
                            </div>

                            <PlayerTable
                                sheetType={sheetType}
                                playerStatsByMatch={playerStatsByMatch}
                                playerPenaltiesByMatch={playerPenaltiesByMatch}
                                team={displayTeamB}
                                updatePlayerStats={updatePlayerStats}
                                updatePlayerPenalties={updatePlayerPenalties}
                                fetchMatchPlayerStats={fetchPlayerStatsByMatch}
                                fetchMatchPlayerPenalties={fetchPlayerPenaltiesByMatch}
                                matchId={matchData?.match_id}
                                setDeleteDialogEntryId={setDeleteDialogEntryId}
                                setDeleteDialogOpen={setDeletePlayerDialogOpen}
                            />
                        </div>
                    </SheetContent>
                </Sheet>
            )}

            <AddDialog
                open={addDialogOpen}
                onOpenChange={setAddDialogOpen}
                dialogType={addDialogType}
                addStat={addStat}
                addPenalties={addPenalties}
                fetchStatsBySportId={fetchStatsBySportId}
                fetchPenaltiesBySportId={fetchPenalties}
                sportId={sportData?.sport_id}
            />

            <AddPlayerDialog
                open={addPlayerStatDialogOpen}
                onOpenChange={setAddPlayerStatDialogOpen}
                dialogType={addPlayerStatDialogType}
                players={teamPlayers}
                addPlayerStats={addPlayerStats}
                addPlayerPenalties={addPlayerPenalties}
                stats={sportStats}
                penalties={penalties}
                fetchMatchPlayerStats={fetchPlayerStatsByMatch}
                fetchMatchPlayerPenalties={fetchPlayerPenaltiesByMatch}
                matchId={matchData?.match_id}
                sportSets={sportData?.max_sets}
                playerStatsByMatch={playerStatsByMatch}
                playerPenaltiesByMatch={playerPenaltiesByMatch}
            />

            <EditDialog
                open={editDialogOpen}
                onOpenChange={setEditDialogOpen}
                dialogType={editDialogType}
                editData={editData}
                updateStat={updateStat}
                updatePenalties={updatePenalties}
                fetchStatsBySportId={fetchStatsBySportId}
                fetchPenaltiesBySportId={fetchPenalties}
                sportId={sportData?.sport_id}
            />

            <DeleteDialog
                open={deletePlayerDialogOpen}
                onOpenChange={setDeletePlayerDialogOpen}
                dialogType={sheetType}
                entry_id={deleteDialogEntryId}
                matchId={matchData?.match_id}
                fetchPlayerStatsByMatch={fetchPlayerStatsByMatch}
                fetchPlayerPenaltiesByMatch={fetchPlayerPenaltiesByMatch}
                deletePlayerStats={deletePlayerStats}
                deletePlayerPenalties={deletePlayerPenalties}
            />

            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete {deleteDialogType === "stats" ? "Stat" : "Penalty"}</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this {deleteDialogType === "stats" ? "stat" : "penalty"}?
                            This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleDeleteDialogSubmit} disabled={deleteDialogLoader}>
                            {deleteDialogLoader && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            Delete {deleteDialogType === "stats" ? "Stat" : "Penalty"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )

}

function formatPlayerStats(players, playersWithStats, playersWithPenalties) {
    const getPlayerStatValue = (player_id, team_id) => {
        const playerStats = playersWithStats?.filter((stat) => stat.player_id === player_id && stat.team_id === team_id);

        return playerStats?.reduce((acc, stat) => acc + stat.value, 0);
    }

    const getPlayerPenaltyValue = (player_id, team_id) => {
        const playerPenalties = playersWithPenalties?.filter((penalty) => penalty.player_id === player_id && penalty.team_id === team_id);

        return playerPenalties?.reduce((acc, penalty) => acc + penalty.value, 0);
    }

    return players?.map((player) => ({
        ...player,
        stat_points: getPlayerStatValue(player.player_id, player.team_id),
        penalty_points: getPlayerPenaltyValue(player.player_id, player.team_id),
    }));
}

function PlayerTable({ sheetType, team, playerStatsByMatch, playerPenaltiesByMatch, updatePlayerStats, updatePlayerPenalties, fetchMatchPlayerStats, fetchMatchPlayerPenalties, matchId, setDeleteDialogEntryId, setDeleteDialogOpen }) {
    const teamId = team?.[0]?.team_id;

    const filterMatchStats = playerStatsByMatch?.filter((stat) =>
        stat.team_id === teamId && team?.some(player => player.player_id === stat.player_id)
    ) || [];

    const filterMatchPenalties = playerPenaltiesByMatch?.filter((penalty) =>
        penalty.team_id === teamId && team?.some(player => player.player_id === penalty.player_id)
    ) || [];

    const handleStatChange = async (entryId, newValue) => {
        try {
            await updatePlayerStats(entryId, { value: newValue });
            await fetchMatchPlayerStats(matchId);
        } catch (error) {
            console.error("Failed to update stat:", error);
            toast.error("Failed to update stat");
        }
    };

    const handlePenaltyChange = async (entryId, newValue) => {
        try {
            await updatePlayerPenalties(entryId, { value: newValue });
            await fetchMatchPlayerPenalties(matchId);
        } catch (error) {
            console.error("Failed to update penalty:", error);
            toast.error("Failed to update penalty");
        }
    };

    if (sheetType === "stats") {
        return (
            <div className="border rounded-lg">
                <Table>
                    <TableHeader className="bg-muted">
                        <TableRow>
                            <TableHead>Player</TableHead>
                            <TableHead>Stat Name</TableHead>
                            <TableHead>Set Number</TableHead>
                            <TableHead>Points</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filterMatchStats.length > 0 ? filterMatchStats.map((ps) => (
                            <TableRow key={ps.entry_id || `${ps.player_id}-${ps.stats_id}`}>
                                <TableCell>{ps.player_name}</TableCell>
                                <TableCell>{ps.stats_name || ps.stat_name}</TableCell>
                                <TableCell>{ps.set_number}</TableCell>
                                <TableCell>
                                    <EditableValueInput
                                        value={ps.value}
                                        onSave={(val) => handleStatChange(ps.entry_id, val)}
                                    />
                                </TableCell>
                                <TableCell>
                                    <Button size="sm"
                                        className="bg-destructive"
                                        onClick={() => {
                                            setDeleteDialogOpen(true)
                                            setDeleteDialogEntryId(ps.entry_id)
                                        }}>
                                        <Trash />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        )) : (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center">No player stats found</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        )
    } else {
        return (
            <div className="border rounded-lg">
                <Table>
                    <TableHeader className="bg-muted">
                        <TableRow>
                            <TableHead>Player</TableHead>
                            <TableHead>Penalty</TableHead>
                            <TableHead>Set</TableHead>
                            <TableHead>Points</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filterMatchPenalties.length > 0 ? filterMatchPenalties.map((pp) => (
                            <TableRow key={pp.entry_id || `${pp.player_id}-${pp.penalty_id}`}>
                                <TableCell>{pp.player_name}</TableCell>
                                <TableCell>{pp.penalty_name}</TableCell>
                                <TableCell>{pp.set_number}</TableCell>
                                <TableCell>
                                    <EditableValueInput
                                        value={pp.value}
                                        onSave={(val) => handlePenaltyChange(pp.entry_id, val)}
                                    />
                                </TableCell>
                                <TableCell>
                                    <Button size="sm"
                                        className="bg-destructive"
                                        onClick={() => {
                                            setDeleteDialogOpen(true)
                                            setDeleteDialogEntryId(pp.entry_id)
                                        }}>
                                        <Trash />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        )) : (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center">No player penalties found</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        )
    }
}

function AddDialog({ open, onOpenChange, dialogType, addStat, addPenalties, fetchStatsBySportId, fetchPenaltiesBySportId, sportId }) {
    const [addDialogLoader, setAddDialogLoader] = useState(false);

    const [addStatData, setAddStatData] = useState({
        stats_name: "",
        is_player_stat: true,
        sport_id: sportId,
    });

    const [addPenaltyData, setAddPenaltyData] = useState({
        penalty_name: "",
        description: "",
        penalty_point: null,
        affects_score: false,
        penalty_limit: null,
        sport_id: sportId,
    });

    const handleAddDialogSubmit = async () => {
        setAddDialogLoader(true);
        if (dialogType === "stats") {
            if (addStatData?.stats_name.trim() === "") {
                toast.error("Please enter a stat name");
                setAddDialogLoader(false);
                return;
            }

            try {

                const res = await addStat({ ...addStatData, sport_id: sportId });

                if (res) {
                    onOpenChange(false);
                    setAddStatData({
                        stats_name: "",
                        is_player_stat: true,
                        sport_id: sportId,
                    });
                    fetchStatsBySportId(sportId)
                }
            } catch (error) {
                console.error(error);
                toast.error("An error occurred");
            } finally {
                setAddDialogLoader(false);
            }
        } else {
            if (addPenaltyData?.penalty_name.trim() === "" || !addPenaltyData?.penalty_point) {
                toast.error("Please enter a penalty name and penalty point");
                setAddDialogLoader(false);
                return;
            }

            try {
                const res = await addPenalties({ ...addPenaltyData, sport_id: sportId });
                if (res) {
                    onOpenChange(false);
                    setAddPenaltyData({
                        penalty_name: "",
                        description: "",
                        penalty_point: "",
                        affects_score: false,
                        penalty_limit: "",
                        sport_id: sportId,
                    });
                    fetchPenaltiesBySportId(sportId)
                }
            } catch (error) {
                console.error(error);
                toast.error("An error occurred");
            } finally {
                setAddDialogLoader(false);
            }
        }
    };


    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {dialogType === "stats" ? "Add Sport Stats" : "Add Sport Penalties"}
                    </DialogTitle>
                    <DialogDescription>
                        {dialogType === "stats" ? "Add sport stats for the match." : "Add sport penalties for the match."}
                    </DialogDescription>
                    {dialogType == "stats" ?
                        (
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="name">Stat Name</Label>
                                <Input
                                    id="stats_name"
                                    value={addStatData.stats_name}
                                    onChange={(e) =>
                                        setAddStatData({
                                            ...addStatData,
                                            stats_name: e.target.value
                                        })}
                                />
                            </div>
                        )
                        :
                        (
                            <div className="grid grid-cols-2 gap-3 items-center">
                                <div className="flex flex-col gap-2 col-span-2">
                                    <Label htmlFor="penalty_name">Penalty Name</Label>
                                    <Input
                                        id="penalty_name"
                                        value={addPenaltyData.penalty_name}
                                        onChange={(e) =>
                                            setAddPenaltyData({
                                                ...addPenaltyData,
                                                penalty_name: e.target.value
                                            })}
                                        required
                                    />
                                </div>
                                <div className="flex flex-col gap-2 col-span-2">
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea
                                        id="description"
                                        value={addPenaltyData.description}
                                        onChange={(e) =>
                                            setAddPenaltyData({
                                                ...addPenaltyData,
                                                description: e.target.value
                                            })}
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="penalty_point">Penalty Points</Label>
                                    <Input
                                        id="penalty_point"
                                        type="number"
                                        value={addPenaltyData.penalty_point}
                                        onChange={(e) =>
                                            setAddPenaltyData({
                                                ...addPenaltyData,
                                                penalty_point: e.target.value
                                            })}
                                        required
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="penalty_limit">Penalty Limit</Label>
                                    <Input
                                        id="penalty_limit"
                                        type="number"
                                        value={addPenaltyData.penalty_limit}
                                        onChange={(e) =>
                                            setAddPenaltyData({
                                                ...addPenaltyData,
                                                penalty_limit: e.target.value
                                            })}
                                    />
                                </div>
                            </div>
                        )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleAddDialogSubmit} disabled={addDialogLoader}>
                            {addDialogLoader && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            {dialogType === "stats" ? "Add Stat" : "Add Penalty"}
                        </Button>
                    </DialogFooter>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )

}

function EditDialog({ open, onOpenChange, dialogType, editData, updatePenalties, updateStat, fetchStatsBySportId, fetchPenaltiesBySportId, sportId }) {
    const [loader, setLoader] = useState(false);
    const [editStatData, setEditStatData] = useState({
        stats_name: "",
        stats_id: null,
    });

    const [editPenaltyData, setEditPenaltyData] = useState({
        penalty_name: "",
        description: "",
        penalty_point: "",
        penalty_limit: "",
        penalty_id: null
    });

    useEffect(() => {
        if (editData) {
            if (dialogType === "stats") {
                setEditStatData({
                    stats_name: editData.stats_name || "",
                    stats_id: editData.stats_id || null,
                });
            } else {
                setEditPenaltyData({
                    penalty_name: editData.penalty_name || "",
                    description: editData.description || "",
                    penalty_point: editData.penalty_point || "",
                    penalty_limit: editData.penalty_limit || "",
                    penalty_id: editData.penalty_id || null
                });
            }
        }
    }, [editData, dialogType]);

    const handleEditSubmit = async () => {
        setLoader(true);
        if (dialogType === "stats") {
            try {
                const res = await updateStat(editStatData);
                if (res?.status === 200) {
                    fetchStatsBySportId(sportId);
                }
            } catch (error) {
                console.log(error);
            } finally {
                setLoader(false);
            }
        } else {
            try {
                const res = await updatePenalties(editPenaltyData);
                if (res?.status === 200) {
                    fetchPenaltiesBySportId(sportId);
                }
            } catch (error) {
                console.log(error);
            } finally {
                setLoader(false);
            }
        }
        onOpenChange(false);
    }
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit {dialogType}</DialogTitle>
                    <DialogDescription>
                        Update the details of {dialogType} {dialogType === "stats" ? editData?.stats_name : editData?.penalty_name}.
                    </DialogDescription>
                </DialogHeader>
                {dialogType === "stats" ? (
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="name">Stat Name</Label>
                        <Input
                            id="stats_name"
                            value={editStatData.stats_name}
                            onChange={(e) =>
                                setEditStatData({
                                    ...editStatData,
                                    stats_name: e.target.value
                                })}
                        />
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-3 items-center">
                        <div className="flex flex-col gap-2 col-span-2">
                            <Label htmlFor="penalty_name">Penalty Name</Label>
                            <Input
                                id="penalty_name"
                                value={editPenaltyData.penalty_name}
                                onChange={(e) =>
                                    setEditPenaltyData({
                                        ...editPenaltyData,
                                        penalty_name: e.target.value
                                    })}
                                required
                            />
                        </div>
                        <div className="flex flex-col gap-2 col-span-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                value={editPenaltyData.description}
                                onChange={(e) =>
                                    setEditPenaltyData({
                                        ...editPenaltyData,
                                        description: e.target.value
                                    })}
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="penalty_point">Penalty Points</Label>
                            <Input
                                id="penalty_point"
                                type="number"
                                value={editPenaltyData.penalty_point}
                                onChange={(e) =>
                                    setEditPenaltyData({
                                        ...editPenaltyData,
                                        penalty_point: e.target.value
                                    })}
                                required
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="penalty_limit">Penalty Limit</Label>
                            <Input
                                id="penalty_limit"
                                type="number"
                                value={editPenaltyData.penalty_limit}
                                onChange={(e) =>
                                    setEditPenaltyData({
                                        ...editPenaltyData,
                                        penalty_limit: e.target.value
                                    })}
                            />
                        </div>
                    </div>
                )}
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleEditSubmit} disabled={loader}>
                        {loader && (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Edit {dialogType}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

function AddPlayerDialog({ open, onOpenChange, dialogType, players, addPlayerStats, addPlayerPenalties, stats, penalties, fetchMatchPlayerStats, fetchMatchPlayerPenalties, matchId, sportSets, playerStatsByMatch, playerPenaltiesByMatch }) {
    const [loader, setLoader] = useState(false);
    const [addData, setAddData] = useState({
        player_id: "",
        match_id: matchId,
        team_id: "",
        stats_id: "",
        penalty_id: "",
        value: "",
        set_number: ""
    });

    const handleAddSubmit = async () => {
        if (addData.player_id === "") {
            toast.error("Please select a player");
            return;
        }
        if (dialogType === "stats" && addData.stats_id === "") {
            toast.error("Please select a stat");
            return;
        }
        if (dialogType === "penalties" && addData.penalty_id === "") {
            toast.error("Please select a penalty");
            return;
        }

        if (addData.value === "") {
            toast.error("Please enter a value");
            return;
        }

        if (addData.set_number === "") {
            toast.error("Please select a set number");
            return;
        }

        // Duplicate check: same player, team, stat/penalty, and set_number in this match
        if (dialogType === "stats") {
            const duplicate = playerStatsByMatch?.find(
                (s) =>
                    Number(s.player_id) === Number(addData.player_id) &&
                    Number(s.team_id) === Number(addData.team_id) &&
                    Number(s.stats_id) === Number(addData.stats_id) &&
                    Number(s.set_number) === Number(addData.set_number)
            );
            if (duplicate) {
                toast.error(`This stat already exists for this player in set ${addData.set_number}. Update the existing entry instead.`);
                return;
            }
        } else {
            const duplicate = playerPenaltiesByMatch?.find(
                (p) =>
                    Number(p.player_id) === Number(addData.player_id) &&
                    Number(p.team_id) === Number(addData.team_id) &&
                    Number(p.penalty_id) === Number(addData.penalty_id) &&
                    Number(p.set_number) === Number(addData.set_number)
            );
            if (duplicate) {
                toast.error(`This penalty already exists for this player in set ${addData.set_number}. Update the existing entry instead.`);
                return;
            }
        }

        setLoader(true);
        try {
            if (dialogType === "stats") {
                await addPlayerStats(addData);
            } else {
                await addPlayerPenalties(addData);
            }
            setLoader(false);
            onOpenChange(false);
            setAddData({
                player_id: "",
                match_id: matchId,
                team_id: "",
                stats_id: "",
                penalty_id: "",
                value: "",
                set_number: ""
            });
            if (dialogType === "stats") {
                await fetchMatchPlayerStats(matchId);
            } else {
                await fetchMatchPlayerPenalties(matchId);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoader(false);
        }
    }
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add {dialogType}</DialogTitle>
                    <DialogDescription>
                        Add a new {dialogType} to the {dialogType}.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="player_id">Player Name</Label>
                        <Select
                            id="player_id"
                            value={addData.player_id}
                            onValueChange={(value) => {
                                const selectedPlayer = players.find(p => p.player_id === value);
                                setAddData({
                                    ...addData,
                                    player_id: value,
                                    team_id: selectedPlayer?.team_id || ""
                                });
                            }}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select a player" />
                            </SelectTrigger>
                            <SelectContent>
                                {players.map((player) => (
                                    <SelectItem key={player.player_id} value={player.player_id}>
                                        {player.first_name} {player.last_name} ({player.jersey_number})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    {dialogType === "stats" ? (
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="stat_name">Stat</Label>
                            <Select
                                id="stas_id"
                                value={addData.stats_id}
                                onValueChange={(value) =>
                                    setAddData({
                                        ...addData,
                                        stats_id: value
                                    })}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select a stats" />
                                </SelectTrigger>
                                <SelectContent>
                                    {stats.map((stat) => (
                                        <SelectItem key={stat.stats_id} value={stat.stats_id}>
                                            {stat.stats_name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="penalty_name">Penalty</Label>
                            <Select
                                id="penalty_id"
                                value={addData.penalty_id}
                                onValueChange={(value) =>
                                    setAddData({
                                        ...addData,
                                        penalty_id: value
                                    })}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select a penalty" />
                                </SelectTrigger>
                                <SelectContent>
                                    {penalties.map((penalty) => (
                                        <SelectItem key={penalty.penalty_id} value={penalty.penalty_id}>
                                            {penalty.penalty_name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="penalty_name">Set Number</Label>
                        <Select
                            id="set_number"
                            value={addData.set_number}
                            onValueChange={(value) =>
                                setAddData({
                                    ...addData,
                                    set_number: value
                                })}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select a set number" />
                            </SelectTrigger>
                            <SelectContent>
                                {Array.from({ length: sportSets }, (_, i) => i + 1).map((s) => (
                                    <SelectItem key={s} value={s}>
                                        {s}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="value">Value</Label>
                        <Input
                            id="value"
                            type="number"
                            min={0}
                            value={addData.value}
                            onChange={(e) =>
                                setAddData({
                                    ...addData,
                                    value: e.target.value
                                })}
                            required
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleAddSubmit} disabled={loader}>
                        {loader && (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Add {dialogType}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )

}

function DeleteDialog({ open, onOpenChange, dialogType, entry_id, matchId, fetchPlayerStatsByMatch, fetchPlayerPenaltiesByMatch, deletePlayerStats, deletePlayerPenalties }) {
    const [loader, setLoader] = useState(false);

    const handleDeleteSubmit = async () => {
        setLoader(true);
        try {
            if (dialogType === "stats") {
                await deletePlayerStats(entry_id);
            } else {
                await deletePlayerPenalties(entry_id);
            }
            setLoader(false);
            onOpenChange(false);
            if (dialogType === "stats") {
                await fetchPlayerStatsByMatch(matchId);
            } else {
                await fetchPlayerPenaltiesByMatch(matchId);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoader(false);
        }
    }
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete Player {dialogType}</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete this player {dialogType}?
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleDeleteSubmit} disabled={loader}>
                        {loader && (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Delete {dialogType}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

