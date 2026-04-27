import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Trash2, Loader2 } from "lucide-react";

export function MatchDetailsDialog({ isOpen, onClose, match, tournamentTeams, teams, onSave }) {
    const [editTeamA, setEditTeamA] = useState("empty");
    const [editTeamB, setEditTeamB] = useState("empty");
    const [editWinner, setEditWinner] = useState(null);
    const [editDate, setEditDate] = useState("");
    const [editStartTime, setEditStartTime] = useState("");
    const [editEndTime, setEditEndTime] = useState("");
    const [editLocation, setEditLocation] = useState("");
    const [editIsFinished, setEditIsFinished] = useState(false);
    const [loader, setLoader] = useState(false);

    useEffect(() => {
        if (match) {
            setEditTeamA(match.team_a_id ? String(match.team_a_id) : null);
            setEditTeamB(match.team_b_id ? String(match.team_b_id) : null);
            setEditWinner(match.winner_id ? String(match.winner_id) : null);
            setEditDate(match.date ? new Date(match.date).toISOString().split('T')[0] : null);
            setEditStartTime(match.start_time || null);
            setEditEndTime(match.end_time || null);
            setEditLocation(match.location || null);
            setEditIsFinished(match.is_finished || false);
        }
    }, [match]);

    const handleSave = async () => {

        const payload = {
            team_a_id: editTeamA,
            team_b_id: editTeamB,
            winner_id: editWinner,
            date: editDate || null,
            start_time: editStartTime || null,
            end_time: editEndTime || null,
            location: editLocation || null,
            is_finished: editIsFinished
        };
        
        try {
            setLoader(true);
            await onSave(payload);
            onClose();
        } catch (error) {
            console.error("Error updating match:", error);
        } finally {
            setLoader(false);

        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[425px]  min-w-[45vw]">
                <DialogHeader>
                    <DialogTitle>Match Details</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4  overflow-y-auto max-h-[70vh] px-2 -mr-2">

                    {/* Teams Selection */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label>Team A</Label>
                            <Select value={editTeamA} onValueChange={setEditTeamA}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select Team A" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="empty">TBD</SelectItem>
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
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select Team B" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="empty">TBD</SelectItem>
                                    {tournamentTeams.map(t => (
                                        <SelectItem key={t.team_id} value={String(t.team_id)}>
                                            {teams.find(tm => tm.team_id === t.team_id)?.name || "Unknown"}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Winner Selection */}
                    <div className="grid gap-2">
                        <Label>Winner</Label>
                        <Select value={editWinner} onValueChange={setEditWinner}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select Winner" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="empty">None / Pending</SelectItem>
                                {editTeamA !== 'empty' && (
                                    <SelectItem value={editTeamA}>
                                        Team A ({teams.find(tm => tm.team_id === parseInt(editTeamA))?.name || "Unknown"})
                                    </SelectItem>
                                )}
                                {editTeamB !== 'empty' && (
                                    <SelectItem value={editTeamB}>
                                        Team B ({teams.find(tm => tm.team_id === parseInt(editTeamB))?.name || "Unknown"})
                                    </SelectItem>
                                )}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Match Schedule & Location */}
                    <div className="grid gap-2">
                        <Label>Date</Label>
                        <Input type="date" value={editDate} onChange={(e) => setEditDate(e.target.value)} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label>Start Time</Label>
                            <Input type="time" value={editStartTime} onChange={(e) => setEditStartTime(e.target.value)} />
                        </div>
                        <div className="grid gap-2">
                            <Label>End Time</Label>
                            <Input type="time" value={editEndTime} onChange={(e) => setEditEndTime(e.target.value)} />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label>Location</Label>
                        <Input type="text" placeholder="e.g. Main Court" value={editLocation} onChange={(e) => setEditLocation(e.target.value)} />
                    </div>

                    {/* Match Status */}
                    <div className="flex items-center justify-between rounded-lg border p-4 shadow-sm">
                        <div className="space-y-0.5">
                            <Label className="text-base">Match Finished</Label>
                            <p className="text-sm text-muted-foreground">Mark this match as completed.</p>
                        </div>
                        <Switch checked={editIsFinished} onCheckedChange={setEditIsFinished} />
                    </div>

                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    <Button onClick={handleSave} disabled={loader}>
                        {loader ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Details"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
