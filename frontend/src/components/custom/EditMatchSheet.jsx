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

export function EditMatchSheet({ sheetOpen, setSheetOpen, handleSaveMatchEdit, matchInformation, loading, editFormData, setEditFormData }) {
    const { teamsBySport, fetchTeamsBySport } = useTeamStore();
    const { players, fetchPlayersBySport } = usePlayerStore();
    const { sports, fetchSportById } = useSportsStore();
    const { deleteMatch } = useMatchStore();
    const isTeamMatch = matchInformation?.is_team !== false;
    const [dialogOpen, setDialogOpen] = useState(false);

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

    const [deleteLoader, setDeleteLoader] = useState(false);
    const handleDeleteMatch = async (match_id) => {
        setDeleteLoader(true);
        const res = await deleteMatch(match_id);
        if (res.success) {
            setDialogOpen(false);
            setSheetOpen(false);
        }
        setDeleteLoader(false);
    }

    return (
        <>
            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                <SheetContent side="right" className="overflow-y-auto">
                    <SheetHeader>
                        <SheetTitle>Edit Match</SheetTitle>
                        <SheetDescription>
                            Update the match details below.
                        </SheetDescription>
                    </SheetHeader>
                    <div className="flex flex-col gap-4 px-4 pb-4">
                        <div className="grid gap-2">
                            <Label htmlFor="edit-match-name">Match Name</Label>
                            <Input
                                id="edit-match-name"
                                value={editFormData.match_name}
                                onChange={(e) => setEditFormData({ ...editFormData, match_name: e.target.value })}
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
                        <div className="grid gap-2">
                            <Label htmlFor="edit-date">Start Time</Label>
                            <Input
                                id="start-time"
                                type="time"
                                value={editFormData.start_time}
                                onChange={(e) => setEditFormData({ ...editFormData, start_time: e.target.value })}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="edit-date">End Time</Label>
                            <Input
                                id="end-time"
                                type="time"
                                value={editFormData.end_time}
                                onChange={(e) => setEditFormData({ ...editFormData, end_time: e.target.value })}
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

                        {/* Match info (read-only) */}
                        <Separator />
                        <div className="grid gap-2">
                            <Label className="text-muted-foreground text-xs uppercase tracking-wide">
                                {isTeamMatch ? "Teams" : "Players"}
                            </Label>
                            <div className="flex flex-col gap-1 text-sm">
                                <p><span className="text-blue-600 font-medium">A:</span> {participantA || "Not set"}</p>
                                <p><span className="text-red-600 font-medium">B:</span> {participantB || "Not set"}</p>
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label className="text-muted-foreground text-xs uppercase tracking-wide">Sport</Label>
                            <p className="text-sm">{sportData?.name}</p>
                        </div>
                        <div className="grid gap-2">
                            <Label className="text-muted-foreground text-xs uppercase tracking-wide">Type</Label>
                            <p className="text-sm">{isTeamMatch ? "Team Match" : "Individual Match"}</p>
                        </div>
                    </div>
                    <SheetFooter>
                        <Button onClick={handleSaveMatchEdit} className="w-full" variant="outline" disabled={loading}>
                            {loading ? "Saving..." : "Save Changes"}
                        </Button>

                        <div className="flex flex-col gap-2 border border-red-200 bg-red-50 px-2 py-3 rounded-md">
                            <p className="text-center text-sm uppercase tracking-wide font-semibold">Danger Zone</p>
                            <p className="text-center text-xs text-red-600">Deleting this match will also delete all the scores and results associated with it.</p>
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