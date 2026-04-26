import { useMatchStore } from "@/store/useMatchStore";
import { adminRoute } from "@/lib/helpers";
import { useSportsStore } from "@/store/useSportsStore";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Eye, SquareArrowOutUpRight, Edit3, Plus } from "lucide-react";
import { formatDateToString, formatTime } from "@/lib/helpers";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageSync } from "@/components/custom/PageSync";
import { useNavigate } from "react-router-dom";
import { useTeamStore } from "@/store/useTeamStore";
import { usePlayerStore } from "@/store/usePlayerStore";
import { EditMatchSheet } from "@/components/custom/EditMatchSheet";
import { formatDateForInput, formatTimeForInput, combineDateAndTime } from "@/lib/helpers";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function ManageMatches() {
    const { matches, fetchMatches, updateMatch } = useMatchStore();
    const { sports, fetchSports } = useSportsStore();
    const { teams, fetchTeams } = useTeamStore();
    const { players, fetchPlayers } = usePlayerStore();
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [matchInfo, setMatchInfo] = useState(null);
    const [loading, setLoading] = useState(false);
    const [editFormData, setEditFormData] = useState({});
    const [openDialog, setOpenDialog] = useState(false);

    useEffect(() => {
        fetchMatches();
        fetchSports();
        fetchTeams();
        fetchPlayers();
    }, [fetchMatches]);

    const findSport = (sport_id) => {
        return sports.find((sport) => sport.sport_id === sport_id);
    }

    const findTeamName = (team_id) => {
        return teams.find((team) => team.team_id === team_id)?.name;
    }

    const findPlayerName = (player_id) => {
        const player = players?.find((player) => player.player_id === player_id)
        return player?.first_name + " " + player?.last_name;
    }

    const handleSaveMatchEdit = async () => {
        if (!matchInfo) return;
        setLoading(true);

        const payload = {
            ...editFormData,
            start_time: combineDateAndTime(editFormData.date, editFormData.start_time),
            end_time: combineDateAndTime(editFormData.date, editFormData.end_time)
        };

        const result = await updateMatch(matchInfo.match_id, payload);
        if (result) {

            fetchMatches();
            fetchSports();
            fetchTeams();
            fetchPlayers();
        }
        setOpen(false);
        setOpenDialog(false);
        setLoading(false);
    };

    // console.log("all match", matches)
    return (
        <div>
            <PageSync page="Manage Matches" />
            <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center">
                    <p className=" text-xl font-semibold ">Match List</p>
                    <Button onClick={() => setOpenDialog(true)}><Plus /> Add Match</Button>
                </div>
                <div className="border overflow-hidden rounded-lg">
                    <Table >
                        <TableHeader className="bg-muted">
                            <TableRow>
                                <TableHead> Match name</TableHead>
                                <TableHead> Type </TableHead>
                                <TableHead> Participants</TableHead>
                                <TableHead> Date created </TableHead>
                                <TableHead> Start time </TableHead>
                                <TableHead> End time </TableHead>
                                <TableHead>Actions </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {matches?.map((match, idx) => (
                                <TableRow key={idx}>
                                    <TableCell >
                                        <p className="text-wrap  max-w-[240px]">
                                            {match.match_name || "--"}
                                        </p>
                                    </TableCell>
                                    <TableCell >
                                        {match.is_team ? "Team" : "Individual"}
                                    </TableCell>
                                    <TableCell>
                                        {match.is_team ? (
                                            <div className="flex items-center gap-1">
                                                <Link to={adminRoute(`ManageTeam?type=regular&id=${match.team_a_id}`)} className="flex items-center gap-2 text-blue-800">
                                                    <SquareArrowOutUpRight size="16" />
                                                    {findTeamName(match.team_a_id)}
                                                </Link >
                                                <p>vs</p>
                                                <Link to={adminRoute(`ManageTeam?type=regular&id=${match.team_b_id}`)} className="flex items-center gap-2 text-blue-800">
                                                    <SquareArrowOutUpRight size="16" />
                                                    {findTeamName(match.team_b_id)}
                                                </Link >
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-1">
                                                <Link to={adminRoute(`Player?id=${match.player_a_id}`)} className="flex items-center gap-2 text-blue-800">
                                                    <SquareArrowOutUpRight size="16" />
                                                    {findPlayerName(match.player_a_id)}
                                                </Link >
                                                <p>vs</p>
                                                <Link to={adminRoute(`Player?id=${match.player_b_id}`)} className="flex items-center gap-2 text-blue-800">
                                                    <SquareArrowOutUpRight size="16" />
                                                    {findPlayerName(match.player_b_id)}
                                                </Link >
                                            </div>
                                        )}
                                    </TableCell>
                                    <TableCell>{formatDateToString(match.date) || "--"}</TableCell>
                                    <TableCell>{formatTime(match.start_time) || "--"}</TableCell>
                                    <TableCell>{formatTime(match.end_time) || "--"}</TableCell>
                                    <TableCell className="flex gap-2 my-3">
                                        <Button variant="outline" size="sm"
                                            onClick={() => navigate(adminRoute(`Sports/${findSport(match.sport_id)?.name}/scoring?m-id=${match.match_id}`))}
                                        >
                                            <Eye />
                                        </Button>
                                        <Button variant="outline" size="sm" className="mr-2" onClick={() => {
                                            setMatchInfo(match);
                                            setEditFormData({
                                                match_name: match?.match_name || "",
                                                date: formatDateForInput(match?.date) || "",
                                                location: match?.location || "",
                                                start_time: formatTimeForInput(match?.start_time) || "",
                                                end_time: formatTimeForInput(match?.end_time) || ""
                                            });
                                            setOpen(true);
                                        }} >
                                            <Edit3 className=" h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}

                            {matches?.length < 1 && (
                                <TableRow >
                                    <TableCell colSpan={7} className="text-center">No match created</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
            <EditMatchSheet matchInformation={matchInfo} sheetOpen={open} setSheetOpen={setOpen} handleSaveMatchEdit={handleSaveMatchEdit} loading={loading} editFormData={editFormData} setEditFormData={setEditFormData} />

            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Choose Sport Match</DialogTitle>
                        <DialogDescription>
                            Choose the sport match you want to create.
                        </DialogDescription>
                    </DialogHeader>
                    <Select onValueChange={(value) => navigate(adminRoute(`Sports/${value}/match`))}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select Sport" />
                        </SelectTrigger>
                        <SelectContent >
                            {sports?.map((sport) => (
                                <SelectItem key={sport.sport_id} value={sport.name}>
                                    {sport.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </DialogContent>
            </Dialog>
        </div>
    );
}