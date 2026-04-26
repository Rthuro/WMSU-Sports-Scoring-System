import { useTeamStore } from "@/store/useTeamStore";
import { usePlayerStore } from "@/store/usePlayerStore";
import { useSportsStore } from "@/store/useSportsStore";
import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { useMatchStore } from "@/store/useMatchStore";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";
import { Activity, Users, User } from "lucide-react";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function EditMatchSheet({ sheetOpen, setSheetOpen, handleSaveMatchEdit, matchInformation, loading, editFormData, setEditFormData }) {
    const { teamsBySport, fetchTeamsBySport } = useTeamStore();
    const { players, fetchPlayersBySport } = usePlayerStore();
    const { sports, fetchSportById } = useSportsStore();
    const { deleteMatch } = useMatchStore();
    const isTeamMatch = matchInformation?.is_team !== false;
    const [dialogOpen, setDialogOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (matchInformation) {
            fetchSportById(matchInformation?.sport_id);

            if (isTeamMatch) {
                fetchTeamsBySport(matchInformation?.sport_id);
            } else {
                fetchPlayersBySport(matchInformation?.sport_id);
            }
        }
    }, [matchInformation?.sport_id, fetchTeamsBySport, fetchSportById, fetchPlayersBySport]);

    const sportData = sports.find((s) => s.sport_id === matchInformation?.sport_id);

    const participantA = isTeamMatch
        ? teamsBySport.find((t) => t.team_id === matchInformation?.team_a_id)
        : (() => {
            const p = players.find((p) => p.player_id === matchInformation?.player_a_id);
            return p;
        })();

    const participantB = isTeamMatch
        ? teamsBySport.find((t) => t.team_id === matchInformation?.team_b_id)
        : (() => {
            const p = players.find((p) => p.player_id === matchInformation?.player_b_id);
            return p;
        })();

    const [deleteLoader, setDeleteLoader] = useState(false);
    const handleDeleteMatch = async (match_id) => {
        setDeleteLoader(true);

        try {
            await deleteMatch(match_id);
        } catch (error) {
            console.log(error);
        } finally {
            setDialogOpen(false);
            setSheetOpen(false);
            navigate(-1)
            setDeleteLoader(false);
        }
    }

    const displayTeam = (isTeamMatch, participant) => {
        if (isTeamMatch) {
            return participant?.name;
        } else {
            return `${participant?.first_name} ${participant?.last_name}`;
        }
    }

    return (
        <>
            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                <SheetContent side="right" className="overflow-y-auto min-w-[500px]">
                    <SheetHeader>
                        <SheetTitle>Edit Match</SheetTitle>
                        <SheetDescription>
                            Update the match details below.
                        </SheetDescription>
                        <div className="flex items-center gap-2 text-sm">
                            <p className="w-full border border-blue-100 bg-blue-50 rounded-lg p-2"><span className="text-blue-600 font-medium">
                                {isTeamMatch ? "Team A" : "Player A"}:</span> {displayTeam(isTeamMatch, participantA) || "Not set"}</p>
                            <p className="w-full border border-red-100 bg-red-50 rounded-lg p-2"><span className="text-red-600 font-medium">
                                {isTeamMatch ? "Team B" : "Player B"}:</span> {displayTeam(isTeamMatch, participantB) || "Not set"}</p>
                        </div>
                        <div className=" flex items-center gap-4 rounded-lg border bg-muted/40 p-3 mt-1 text-sm">
                            <div className="flex items-center gap-2 w-full">
                                <Activity className="h-4 w-4 text-muted-foreground" />
                                <p className="font-medium">{sportData?.name || "—"}</p>
                            </div>
                            <div className="flex items-center gap-2 w-full">
                                {isTeamMatch ? <Users className="h-4 w-4 text-muted-foreground" /> : <User className="h-4 w-4 text-muted-foreground" />}
                                <p>{isTeamMatch ? "Team Match" : "Individual Match"}</p>
                            </div>
                        </div>
                    </SheetHeader>
                    <div className="flex flex-col gap-4 px-4 pb-4">
                        <div className="grid gap-2">
                            <Label htmlFor="edit-match-name">Winner</Label>
                            <Select
                                value={editFormData?.winner || null}
                                onValueChange={(value) => setEditFormData({ ...editFormData, winner: value })}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select Winner" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value={null}>Not Set</SelectItem>
                                    {participantA ? <SelectItem value={participantA}>{displayTeam(isTeamMatch, participantA)}
                                    </SelectItem> : null}
                                    {participantB ? <SelectItem value={participantB}>{displayTeam(isTeamMatch, participantB)}</SelectItem> :
                                        null}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="edit-match-name">Match Name</Label>
                            <Input
                                id="edit-match-name"
                                value={editFormData.match_name}
                                onChange={(e) => setEditFormData({ ...editFormData, match_name: e.target.value })}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="edit-location">Location</Label>
                            <Input
                                id="edit-location"
                                value={editFormData.location}
                                onChange={(e) => setEditFormData({ ...editFormData, location: e.target.value })}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="edit-date">Date</Label>
                            <Input
                                id="edit-date"
                                type="date"
                                value={editFormData.date}
                                onChange={(e) => setEditFormData({ ...editFormData, date: e.target.value })}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="start-time">Start Time</Label>
                                <Input
                                    id="start-time"
                                    type="time"
                                    value={editFormData.start_time}
                                    onChange={(e) => setEditFormData({ ...editFormData, start_time: e.target.value })}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="end-time">End Time</Label>
                                <Input
                                    id="end-time"
                                    type="time"
                                    value={editFormData.end_time}
                                    onChange={(e) => setEditFormData({ ...editFormData, end_time: e.target.value })}
                                />
                            </div>
                        </div>

                    </div>
                    <SheetFooter>
                        <Button onClick={handleSaveMatchEdit} className="w-full" variant="outline" disabled={loading}>
                            {loading ? "Saving..." : "Save Changes"}
                        </Button>

                        <div className="flex flex-col gap-3 border border-red-200 bg-red-50 px-2 py-3 rounded-md items-center">
                            <p className="text-center text-sm uppercase tracking-wide font-semibold">Danger Zone</p>
                            <p className="text-center text-xs text-red-600 max-w-72">Deleting this match will also delete all the scores and results associated with it.</p>
                            <Button onClick={() => setDialogOpen(true)} className="w-full" variant="destructive">
                                Delete Match
                            </Button>
                        </div>
                    </SheetFooter>
                </SheetContent>
            </Sheet>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Match</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this match?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button onClick={() => setDialogOpen(false)} variant="outline">Cancel</Button>
                        <Button onClick={() => handleDeleteMatch(matchInformation?.match_id)} variant="destructive">
                            {deleteLoader ? "Deleting..." : "Delete"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}