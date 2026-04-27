import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Trash2, Loader2 } from "lucide-react";
import { useTournamentStore } from "@/store/useTournamentStore2";
import { useNavigate } from "react-router-dom";

export function EditTournamentDialog({ isOpen, onClose, tournament }) {
    const navigate = useNavigate();
    const { updateTournament, deleteTournament } = useTournamentStore();
    const [loader, setLoader] = useState(false);

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [location, setLocation] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        if (tournament) {
            setName(tournament.name || "");
            setDescription(tournament.description || "");
            setStartDate(tournament.start_date ? new Date(tournament.start_date).toISOString().split('T')[0] : "");
            setEndDate(tournament.end_date ? new Date(tournament.end_date).toISOString().split('T')[0] : "");
            setLocation(tournament.location || "");
        }
    }, [tournament]);

    const handleSave = async () => {
        const payload = {
            name: name || undefined,
            description: description || undefined,
            start_date: startDate ? new Date(startDate).toISOString() : undefined,
            end_date: endDate ? new Date(endDate).toISOString() : undefined,
            location: location || undefined
        };

        setLoader(true);
        try {
            const success = await updateTournament(tournament.tournament_id, payload);
            if (success) {
                onClose();
            }
        } catch (error) {
            console.error("Error updating tournament:", error);
        } finally {
            setLoader(false);
        }
        
    };

    const [deleteLoader, setDeleteLoader] = useState(false);
    const handleDelete = async () => {
        setDeleteLoader(true);
        try {
            const success = await deleteTournament(tournament.tournament_id);
            if (success) {
                onClose();
                navigate(-1);
            }
        } catch (error) {
            console.error("Error deleting tournament:", error);
        } finally {
            setDeleteLoader(false);
        }
    };

    return (
        <>
            <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Edit Tournament</DialogTitle>
                    </DialogHeader>
                    
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label>Name</Label>
                            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Tournament Name" />
                        </div>
                        
                        <div className="grid gap-2">
                            <Label>Description</Label>
                            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Enter a description" />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label>Start Date</Label>
                                <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                            </div>
                            <div className="grid gap-2">
                                <Label>End Date</Label>
                                <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label>Location</Label>
                            <Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Location details" />
                        </div>
                    </div>

                    <DialogFooter className="flex justify-between sm:justify-between items-center w-full">
                        <Button variant="destructive" size="icon" onClick={() => setIsDeleting(true)} title="Delete Tournament">
                            <Trash2 className="h-4 w-4" />
                        </Button>

                        <div className="flex gap-2">
                            <Button variant="outline" onClick={onClose}>Cancel</Button>
                            <Button onClick={handleSave} disabled={loader}>{loader ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Changes"}</Button>
                        </div>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={isDeleting} onOpenChange={setIsDeleting}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Delete Tournament</DialogTitle>
                    </DialogHeader>
                    <p className="py-4 text-sm text-muted-foreground">
                        Are you sure you want to delete this tournament? All associated brackets, matches, and data might be removed. This action cannot be undone.
                    </p>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDeleting(false)}>Cancel</Button>
                        <Button variant="destructive" onClick={handleDelete}>
                            {deleteLoader ? <Loader2 className="h-4 w-4 animate-spin" /> : "Confirm Delete" }
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </    >
    );
}
