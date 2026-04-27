import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { Eye, Edit3Icon, Trash2 } from "lucide-react";
import { useState } from 'react';
import { capitalizeFirstLetter } from '@/lib/helpers';
import { useNavigate } from "react-router-dom";
import { usePlayerStore } from "@/store/usePlayerStore";
import { useSportsStore } from "@/store/useSportsStore";
import {useTeamPlayerStore} from "@/store/useTeamPlayerStore";

function tableHeaders (section) {
    switch (section) {
        case 'sport':
            return ["Player", "Department", "Matches Played", "Position", "Actions"]
        case 'department':
            return ["Player", "Sport", "Matches Played", "Position", "Actions"]
        case 'team':
            return ["Player", "Sport",  "Gender", "Position", "Actions"]
        default:
            return ["Player", "Sport", "Gender", "Student ID", "Actions"]
    }
}

export function PlayersTable({ sport, department, team }) {
    const [playersList, setPlayersList] = useState([]);
    const { players, removePlayer, fetchPlayersBySport, fetchPlayersByDepartment, fetchPlayerByTeam } = usePlayerStore();
    const navigate = useNavigate();
    
    const handleDeletePlayer = async (e, id) => {
        const success = await removePlayer(e, id);
        if (success) {
            document.getElementById("playerDeleteDialog").close();
            return;
        }
    }

    const [displayPlayers, setDisplayPlayers] = useState(players || []);


    return (
        <div className="flex flex-col gap-2">
            <Input placeholder="Search team by name" className="w-1/3 -mb-3"
                onChange={(e) => {
                    setDisplayPlayers(players.filter(player =>
                        player.first_name.toLowerCase().includes(e.target.value.toLowerCase()) ||
                        player.last_name.toLowerCase().includes(e.target.value.toLowerCase())
                    ));
                }}
            />
            <section className="border rounded-lg overflow-hidden">
                <Table >
                    <TableHeader className="bg-muted">
                        <TableRow>
                            <TableHead>Player</TableHead>
                            <TableHead>Sport</TableHead>
                            <TableHead>Gender</TableHead>
                            <TableHead>Student ID</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {displayPlayers?.map((player) => (
                            <TableRow key={player.player_id}>
                                <TableCell className="font-medium ">
                                    <div>
                                        {capitalizeFirstLetter(player.first_name)}
                                        &nbsp;
                                        {capitalizeFirstLetter(player.middle_initial)}
                                        &nbsp;
                                        {capitalizeFirstLetter(player.last_name)}
                                    </div>
                                </TableCell>
                                <TableCell className="font-medium ">
                                    {capitalizeFirstLetter(sports.find(s => s.sport_id == player.sport_id)?.name)}
                                </TableCell>
                                <TableCell className="font-medium ">
                                    {capitalizeFirstLetter(player.gender)}
                                </TableCell>
                                <TableCell className="font-medium ">
                                    {player.student_id || "--"}
                                </TableCell>
                                <TableCell className="flex gap-2">
                                    <Button variant="outline" size="sm"
                                        onClick={() => navigate(`/TeamManagement/${player.player_id}`)}
                                    >
                                        <Eye />
                                    </Button>
                                    <Button variant="outline" size="sm"  >
                                        <Edit3Icon className=" h-4 w-4" />
                                    </Button>
                                    <Dialog id="playerDeleteDialog">
                                        <DialogTrigger asChild >
                                            <Button variant="destructive" size="sm">
                                                <Trash2 className=" h-4 w-4" />
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className=" w-96 space-y-2">
                                            <DialogHeader>
                                                <div className="bg-red-50 rounded-full p-3 w-fit mx-auto mb-2 flex items-center justify-center">
                                                    <Trash2 className="size-6 text-red-500 " />
                                                </div>

                                                <DialogTitle className="text-center">Are you sure?</DialogTitle>
                                                <DialogDescription className="text-center text-sm">
                                                    Are you sure you want to delete this player? <br /> This action cannot be undone.
                                                </DialogDescription>
                                            </DialogHeader>
                                            <div className="grid grid-cols-2 gap-4">
                                                <DialogClose asChild>
                                                    <Button variant="outline" size="lg" className="cursor-pointer">
                                                        Cancel
                                                    </Button>
                                                </DialogClose>

                                                <Button variant="destructive" size="lg" className="cursor-pointer"
                                                    onClick={(e) => handleDeletePlayer(e, player.player_id)}
                                                >
                                                    Confirm
                                                </Button>
                                            </div>
                                        </DialogContent>
                                    </Dialog>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </section>
        </div>
    )
}