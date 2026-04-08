import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export function TeamRecordDialog({ isOpen, onClose, teamId, tournamentMatch, teams }) {
    if (!teamId) return null;

    const team = teams?.find(t => t.team_id == teamId);
    
    // Filter matches involving this team
    const teamMatches = tournamentMatch?.filter(m => m.team_a_id == teamId || m.team_b_id == teamId) || [];

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{team?.name || "Team"} - Match Records</DialogTitle>
                </DialogHeader>

                <div className="py-4">
                    {teamMatches.length === 0 ? (
                        <p className="text-center text-muted-foreground py-4">No match records found for this team.</p>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Match</TableHead>
                                    <TableHead>Opponent</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Result</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {teamMatches.map((match) => {
                                    const isTeamA = match.team_a_id == teamId;
                                    const opponentId = isTeamA ? match.team_b_id : match.team_a_id;
                                    const opponent = teams?.find(t => t.team_id == opponentId);

                                    let result = "Pending";
                                    let variant = "secondary";
                                    
                                    if (match.is_finished || match.winner_id != null) {
                                        if (match.winner_id == teamId) {
                                            result = "Win";
                                            variant = "default"; // Will show as primary color (blue/black depending on theme)
                                        } else if (match.winner_id != null && match.winner_id != 'empty') {
                                            result = "Loss";
                                            variant = "destructive"; // Red
                                        } else {
                                            result = "Draw / TBD";
                                            variant = "outline";
                                        }
                                    }

                                    return (
                                        <TableRow key={match.match_id}>
                                            <TableCell className="font-medium">
                                                {match.match_name.split(' ')[0]} {/* Output 'Match 1', 'SE_R1_M1', etc. */}
                                            </TableCell>
                                            <TableCell>
                                                {opponent ? opponent.name : "TBD"}
                                            </TableCell>
                                            <TableCell>
                                                {match.is_finished ? "Finished" : "Scheduled"}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={variant}>{result}</Badge>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    )}
                </div>

                <DialogFooter>
                    <Button onClick={onClose}>Close</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
