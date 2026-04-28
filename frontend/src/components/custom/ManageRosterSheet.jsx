import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useSportsStore } from "@/store/useSportsStore";
import { adminRoute } from "@/lib/helpers";
import { toast } from "react-hot-toast";
import axios from "axios";
import { 
    UserPlus, 
    Edit2, 
    Trash2, 
    X, 
    Save, 
    ExternalLink, 
    Users,
    Loader2
} from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { usePlayerStore } from "@/store/usePlayerStore";
import { useTeamPlayersStore } from "@/store/useTeamStore";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:3000" : import.meta.env.VITE_API_URL;

export function ManageRosterSheet({ sheetOpen, setSheetOpen, teamId, type, sportId, currentPlayers = [], onUpdate }) {
    const navigate = useNavigate();
    const { fetchPositions, positions } = useSportsStore();
    const { fetchPlayersBySport, players, addPlayer } = usePlayerStore();
    const {updatePlayerTeam, addPlayerTeam, deletePlayerTeam, fetchTeamProfile} = useTeamPlayersStore();

    const [loading, setLoading] = useState(false);
    const [playersLoading, setPlayersLoading] = useState(false);
    const [availablePlayers, setAvailablePlayers] = useState([]);
    const [editingPlayer, setEditingPlayer] = useState(null);
    const [isAddingNew, setIsAddingNew] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [playerToDelete, setPlayerToDelete] = useState(null);
    const [deleteLoader, setDeleteLoader] = useState(false);
    const [editOpen, setEditOpen] = useState(false);

    const [editFormData, setEditFormData] = useState({
        player_id: "",
        position_id: "",
        jersey_number: ""
    });

    const [newPlayerFormData, setNewPlayerFormData] = useState({
        first_name: "",
        last_name: "",
        middle_initial: "",
        gender: "",
        student_id: ""
    });

    const [selectedExistingPlayer, setSelectedExistingPlayer] = useState(null);
    const [newPlayerTeamData, setNewPlayerTeamData] = useState({
        position_id: "",
        jersey_number: ""
    });

    const fetchAvailablePlayers = useCallback(async () => {
        setPlayersLoading(true);
        try {
            // Get sports player to add in the team roster
            await fetchPlayersBySport(sportId);
            const currentPlayerIds = currentPlayers.map(p => p.player_id);
            const available = players.filter(p => !currentPlayerIds.includes(p.player_id));
            setAvailablePlayers(available);
        } catch (error) {
            console.error("Error fetching available players:", error);
        } finally {
            setPlayersLoading(false);
        }
    }, [sportId, currentPlayers]);

    useEffect(() => {
        if (sheetOpen && sportId) {
            fetchPositions(sportId);
            fetchAvailablePlayers();
        }
    }, [sheetOpen, sportId, fetchPositions, fetchAvailablePlayers]);

    const handleOpenEdit = (player) => {
        setEditOpen(true);
        setEditFormData({
            player_team_id: player.id,
            position_id: player.position_id || "",
            jersey_number: player.jersey_number || ""
        });
    };

    console.log(currentPlayers)
    const handleSaveEdit = async () => {
        setLoading(true);
        try {
            
            await updatePlayerTeam(editFormData.player_team_id, {
                position_id: editFormData.position_id || null,
                jersey_number: editFormData.jersey_number || null
            });

            setEditFormData({ player_team_id: "", position_id: "", jersey_number: "" });
            setEditOpen(false);

            if (onUpdate) {
                onUpdate();
            }
        } catch (error) {
            console.error("Error updating player:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddExistingPlayer = async () => {
        if (!selectedExistingPlayer || !newPlayerTeamData.jersey_number) {
            toast.error("Please select a player and enter jersey number");
            return;
        }

        setLoading(true);
        try {
            await addPlayerTeam({
                player_id: selectedExistingPlayer.player_id,
                team_id: teamId,
                position_id: newPlayerTeamData.position_id || null,
                jersey_number: newPlayerTeamData.jersey_number || null
            });

            setSelectedExistingPlayer(null);
            setNewPlayerTeamData({ position_id: "", jersey_number: "" });
            setIsAddingNew(false);
            
            if (onUpdate) {
                onUpdate();
            }
            fetchAvailablePlayers();
        } catch (error) {
            console.error("Error adding player:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddNewPlayer = async () => {
        if (!newPlayerFormData.first_name || !newPlayerFormData.last_name || !newPlayerFormData.gender) {
            toast.error("Please fill in required fields");
            return;
        }

        setLoading(true);
        try {
            const playerRes = await addPlayer({
                ...newPlayerFormData,
                sport_id: sportId
            });

            const newPlayer = playerRes.data.data;

            await addPlayerTeam({
                player_id: newPlayer.player_id,
                team_id: teamId,
                position_id: newPlayerTeamData.position_id || null,
                jersey_number: newPlayerTeamData.jersey_number || null
            });

            setNewPlayerFormData({
                first_name: "",
                last_name: "",
                middle_initial: "",
                gender: "",
                student_id: ""
            });
            setNewPlayerTeamData({ position_id: "", jersey_number: "" });
            setIsAddingNew(false);

            if (onUpdate) {
                onUpdate();
            }
        } catch (error) {
            console.error("Error creating player:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeletePlayer = async () => {
        if (!playerToDelete) return;

        setDeleteLoader(true);
        try {
            const playerTeamId = playerToDelete.id ;
            await deletePlayerTeam(playerTeamId);
            
            setDeleteDialogOpen(false);
            setPlayerToDelete(null);
            

            if (onUpdate) {
                onUpdate();
            }
            fetchAvailablePlayers();
        } catch (error) {
            console.error("Error removing player:", error);
        } finally {
            setDeleteLoader(false);
        }
    };

    const handleViewPlayer = (playerId) => {
        setSheetOpen(false);
        navigate(adminRoute(`Player/?id=${playerId}`));
    };

    const getPositionName = (positionId) => {
        const position = positions?.find(p => p.id === positionId);
        return position ? position?.position_name : "—";
    };

    return (
        <>
            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                <SheetContent side="right" className="overflow-y-auto min-w-[500px]">
                    <SheetHeader>
                        <SheetTitle>Manage Roster</SheetTitle>
                        <SheetDescription>
                            Add, edit, or remove players from this team.
                        </SheetDescription>
                    </SheetHeader>

                    <div className="flex flex-col gap-4 py-4 px-4">
                        {!isAddingNew ? (
                            <Button 
                                onClick={() => setIsAddingNew(true)} 
                                className="w-full gap-2"
                            >
                                <UserPlus size={16} />
                                Add Player to Team
                            </Button>
                        ) : (
                            <div className="border rounded-lg p-4 space-y-4 bg-slate-50">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-semibold">Add Player</h3>
                                    <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        onClick={() => {
                                            setIsAddingNew(false);
                                            setSelectedExistingPlayer(null);
                                        }}
                                    >
                                        <X size={16} />
                                    </Button>
                                </div>

                                <Separator />

                                {!selectedExistingPlayer ? (
                                    <div className="space-y-3">
                                        <p className="text-sm text-muted-foreground">Select from available players:</p>
                                        {playersLoading ? (
                                            <div className="flex items-center justify-center py-4">
                                                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                                            </div>
                                        ) : availablePlayers.length > 0 ? (
                                            <div className="max-h-48 overflow-y-auto border rounded-md">
                                                {availablePlayers?.map(player => (
                                                    <div 
                                                        key={player.player_id}
                                                        className="flex items-center justify-between p-2 hover:bg-slate-100 cursor-pointer border-b last:border-b-0"
                                                        onClick={() => setSelectedExistingPlayer(player)}
                                                    >
                                                        <span className="font-medium">
                                                            {player.first_name} {player.last_name}
                                                        </span>
                                                        <span className="text-xs text-muted-foreground">
                                                            {player.id_number || player.student_id || 'No ID'}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-sm text-muted-foreground text-center py-4">
                                                No available players. Create a new one below.
                                            </p>
                                        )}
                                        
                                        <div className="text-center py-2">
                                            <p className="text-sm text-muted-foreground">or</p>
                                        </div>

                                        <div className="space-y-3 pt-2">
                                            <p className="text-sm font-medium">Create New Player:</p>
                                            <div className="grid grid-cols-2 gap-2">
                                                <div className="grid gap-1">
                                                    <Label htmlFor="first_name">First Name *</Label>
                                                    <Input
                                                        id="first_name"
                                                        value={newPlayerFormData.first_name}
                                                        onChange={(e) => setNewPlayerFormData({...newPlayerFormData, first_name: e.target.value})}
                                                        required
                                                    />
                                                </div>
                                                <div className="grid gap-1">
                                                    <Label htmlFor="last_name">Last Name *</Label>
                                                    <Input
                                                        id="last_name"
                                                        value={newPlayerFormData.last_name}
                                                        onChange={(e) => setNewPlayerFormData({...newPlayerFormData, last_name: e.target.value})}
                                                        required
                                                    />
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-2">
                                                <div className="grid gap-1">
                                                    <Label htmlFor="middle_initial">Middle Initial</Label>
                                                    <Input
                                                        id="middle_initial"
                                                        value={newPlayerFormData.middle_initial}
                                                        onChange={(e) => setNewPlayerFormData({...newPlayerFormData, middle_initial: e.target.value})}
                                                    />
                                                </div>
                                                <div className="grid gap-1">
                                                    <Label htmlFor="student_id">ID Number</Label>
                                                    <Input
                                                        id="student_id"
                                                        value={newPlayerFormData.student_id}
                                                        onChange={(e) => setNewPlayerFormData({...newPlayerFormData, student_id: e.target.value})}
                                                    />
                                                </div>
                                            </div>
                                            <div className="grid gap-1">
                                                <Label htmlFor="gender">Gender *</Label>
                                                <Select
                                                    value={newPlayerFormData.gender}
                                                    onValueChange={(value) => setNewPlayerFormData({...newPlayerFormData, gender: value})}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select gender" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="Male">Male</SelectItem>
                                                        <SelectItem value="Female">Female</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between p-2 bg-white rounded-md border">
                                            <span className="font-medium">
                                                {selectedExistingPlayer.first_name} {selectedExistingPlayer.last_name}
                                            </span>
                                            <Button 
                                                variant="ghost" 
                                                size="sm" 
                                                onClick={() => setSelectedExistingPlayer(null)}
                                            >
                                                <X size={16} />
                                            </Button>
                                        </div>
                                    </div>
                                )}

                                <Separator />

                                <div className="space-y-3">
                                    <h4 className="font-medium text-sm">Team Assignment</h4>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="grid gap-1">
                                            <Label>Position</Label>
                                            <Select
                                                value={newPlayerTeamData.position_id}
                                                onValueChange={(value) => setNewPlayerTeamData({...newPlayerTeamData, position_id: value})}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select position" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {positions.map(pos => (
                                                        <SelectItem key={pos.id} value={String(pos.id)}>
                                                            {pos.position_name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="grid gap-1">
                                            <Label>Jersey Number *</Label>
                                            <Input
                                                value={newPlayerTeamData.jersey_number}
                                                onChange={(e) => setNewPlayerTeamData({...newPlayerTeamData, jersey_number: e.target.value})}
                                                placeholder="e.g., 10"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <Button 
                                    onClick={selectedExistingPlayer ? handleAddExistingPlayer : handleAddNewPlayer}
                                    disabled={loading}
                                    className="w-full"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Adding...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="mr-2 h-4 w-4" />
                                            {selectedExistingPlayer ? "Add Player" : "Create & Add Player"}
                                        </>
                                    )}
                                </Button>
                            </div>
                        )}

                        <Separator />

                        <div className="space-y-2">
                            <h3 className="font-semibold flex items-center gap-2">
                                <Users size={18} />
                                Current Roster ({currentPlayers.length})
                            </h3>
                            
                            {currentPlayers.length === 0 ? (
                                <p className="text-sm text-muted-foreground text-center py-4">
                                    No players in this team yet.
                                </p>
                            ) : (
                                <div className="space-y-2 max-h-[400px] overflow-y-auto">
                                    {currentPlayers.map(player => (
                                        <div 
                                            key={player.player_id}
                                            className="flex items-center justify-between p-3 border rounded-lg bg-white hover:bg-slate-50"
                                        >
                                            <div className="flex-1">
                                                <p className="font-medium">
                                                    {player.first_name} {player.last_name}
                                                </p>
                                                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                                    <span>Jersey: {player.jersey_number || "—"}</span>
                                                    <span>Position: {player.position_id ? getPositionName(player.position_id) : "—"}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleViewPlayer(player.player_id)}
                                                    title="View Player"
                                                >
                                                    <ExternalLink size={16} />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleOpenEdit(player)}
                                                    title="Edit"
                                                >
                                                    <Edit2 size={16} />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-red-500 hover:text-red-600"
                                                    onClick={() => {
                                                        setPlayerToDelete(player);
                                                        setDeleteDialogOpen(true);
                                                    }}
                                                    title="Remove"
                                                >
                                                    <Trash2 size={16} />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </SheetContent>
            </Sheet>

            {/* Edit Player Dialog */}
            <Dialog open={editOpen} onOpenChange={setEditOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Player Assignment</DialogTitle>
                        <DialogDescription>
                            Update position and jersey number for {editingPlayer?.first_name} {editingPlayer?.last_name}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="grid gap-2">
                            <Label>Position</Label>
                            <Select
                                value={editFormData.position_id}
                                onValueChange={(value) => setEditFormData({...editFormData, position_id: value})}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select position" />
                                </SelectTrigger>
                                <SelectContent>
                                    {positions?.map(pos => (
                                        <SelectItem key={pos.id} value={String(pos.id)}>
                                            {pos.position_name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label>Jersey Number</Label>
                            <Input
                                value={editFormData.jersey_number}
                                onChange={(e) => setEditFormData({...editFormData, jersey_number: e.target.value})}
                                placeholder="e.g., 10"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setEditingPlayer(null)}>
                            Cancel
                        </Button>
                        <Button onClick={handleSaveEdit} disabled={loading}>
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                "Save Changes"
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Remove Player</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to remove {playerToDelete?.first_name} {playerToDelete?.last_name} from this team?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleDeletePlayer} disabled={deleteLoader}>
                            {deleteLoader ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Removing...
                                </>
                            ) : (
                                "Remove Player"
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}