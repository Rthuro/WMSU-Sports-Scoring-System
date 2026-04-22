import { PageSync } from "@/components/custom/PageSync"
import { Card, CardHeader, CardFooter, CardTitle } from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom";
import { Users2, ArrowRight, UsersRound, Edit3Icon, Trash2, Eye, RefreshCw } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { capitalizeFirstLetter } from '@/lib/helpers';
import { useTeamStore } from "@/store/useTeamStore";
import { useDepartmentStore } from "@/store/useDepartmentStore";
import { useSportsStore } from "@/store/useSportsStore";
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { usePlayerStore } from "@/store/usePlayerStore";
import { useEventStore } from "@/store/useEventStore";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { adminRoute } from "@/lib/helpers";

export function TeamManagement() {
    const navigate = useNavigate();
    const { teams, fetchTeams, deleteTeam } = useTeamStore();
    const { departments } = useDepartmentStore();
    const { sports } = useSportsStore();
    const { players, removePlayer } = usePlayerStore();
    const { events } = useEventStore();


    const handleDeletePlayer = async (e, id) => {
        const success = await removePlayer(e, id);
        if (success) {
            document.getElementById("playerDeleteDialog").close();
            return;
        }
    }

    const handleDeleteTeam = async (e, id) => {
        e.preventDefault();
        const success = await deleteTeam(id);
        if (success) {
            navigate(-1)
        }
    }
    const [displayAllTeams, setDisplayAllTeams] = useState(teams || []);

    const displayEventTeams = teams.filter(t => t.event_id !== null);
    const displayDepartmentTeams = teams.filter(t => t.department_id !== null);
    const displaySportTeams = teams.filter(t => t.event_id == null && t.department_id == null);

    const [displayPlayers, setDisplayPlayers] = useState(players || []);

    return (
        <section className="flex flex-col gap-6 ">
            <PageSync page="Team Management" />
            <div className=" dark:*:data-[slot=card]:bg-card grid grid-cols-2 gap-3  @xl/main:grid-cols-2 @5xl/main:grid-cols-3 ">
                <Link to={adminRoute(`TeamManagement/CreateTeam`)} >
                    <Card className="@container/card bg-white shadow-md border border-red-100 shadow-red-50 hover:shadow-lg cursor-pointer">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3 tabular-nums ">
                                <div className="bg-red-50 text-red border border-red-200 rounded-lg p-3">
                                    <Users2 className="size-5 " />
                                </div>
                                <div>
                                    <p className="text-lg @[250px]/card:text-xl font-semibold">
                                        {teams?.length || 0}
                                    </p>
                                    <p className="text-accent-foreground text-sm font-normal">Team(s)</p>
                                </div>
                            </CardTitle>
                        </CardHeader>
                        <CardFooter className="flex-col flex gap-3">
                            <Separator />
                            <div className="flex items-center justify-between w-full text-red text-sm">
                                <p>Create team(s)</p>
                                <ArrowRight className="size-4 " />
                            </div>
                        </CardFooter>
                    </Card>
                </Link>
                <Link to={adminRoute(`Sports/AddPlayer`)} >
                    <Card className="@container/card bg-white shadow-md border border-red-100 shadow-red-50  cursor-pointer">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3 tabular-nums ">
                                <div className="bg-red-50 text-red border border-red-200 rounded-lg p-3">
                                    <UsersRound className="size-5 " />
                                </div>
                                <div>
                                    <p className="text-lg @[250px]/card:text-xl font-semibold">
                                        {players?.length || 0}
                                    </p>
                                    <p className="text-accent-foreground text-sm font-normal">Players</p>
                                </div>
                            </CardTitle>
                        </CardHeader>
                        <CardFooter className="flex-col flex gap-3">
                            <Separator />
                            <div className="flex items-center justify-between w-full text-red text-sm">
                                <p>Add player</p>
                                <ArrowRight className="size-4 " />
                            </div>
                        </CardFooter>
                    </Card>
                </Link>
            </div>

            <Separator />
            <div className="flex justify-between ">
                <p className=" text-2xl font-semibold ">Team(s)</p>
                <Button variant="outline" className="w-fit flex self-end" onClick={fetchTeams}>
                    <RefreshCw className="size-4" />
                    Refresh
                </Button>
            </div>

            <Tabs defaultValue="all">
                <TabsList>
                    <TabsTrigger value="all">All Teams</TabsTrigger>
                    <TabsTrigger value="events">Event Teams</TabsTrigger>
                    <TabsTrigger value="departments">Department Teams</TabsTrigger>
                    <TabsTrigger value="sports">Sport Teams</TabsTrigger>
                </TabsList>
                <TabsContent value="all" className="flex flex-col gap-2 p-3 ">
                    <Input placeholder="Search team by name" className="w-1/3"
                        onChange={(e) => {
                            setDisplayAllTeams(teams.filter(team =>
                                team.name.toLowerCase().includes(e.target.value.toLowerCase())
                            ));
                        }}
                    />
                    <section className="border rounded-lg overflow-hidden">
                        <Table >
                            <TableHeader className="bg-muted">
                                <TableRow>
                                    <TableHead>Team</TableHead>
                                    <TableHead>Event</TableHead>
                                    <TableHead>Department</TableHead>
                                    <TableHead>Sport</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {displayAllTeams?.map((team) => (
                                    <TableRow key={team.team_id}>
                                        <TableCell className="font-medium ">
                                            <div>
                                                {capitalizeFirstLetter(team.name)}
                                            </div>
                                        </TableCell>
                                        <TableCell className="font-medium ">
                                            {capitalizeFirstLetter(events.find(e => e.event_id == team.event_id)?.name) || "--"}
                                        </TableCell>
                                        <TableCell className="font-medium ">
                                            {capitalizeFirstLetter(departments.find(d => d.department_id == team.department_id)?.name) || "--"}
                                        </TableCell>
                                        <TableCell className="font-medium ">
                                            {capitalizeFirstLetter(sports.find(s => s.sport_id == team.sport_id)?.name)}
                                        </TableCell>
                                        <TableCell className="flex gap-2">
                                            <Button variant="outline" size="sm"
                                                onClick={() => navigate(adminRoute(`ManageTeam?type=${team.event_id ? 'tournament' : 'regular'}&id=${team.team_id}`))}
                                            >
                                                <Eye />
                                            </Button>
                                            <Button variant="outline" size="sm"  >
                                                <Edit3Icon className=" h-4 w-4" />
                                            </Button>
                                            <Dialog id="teamDeleteDialog">
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
                                                            Are you sure you want to delete this team? <br /> This action cannot be undone.
                                                        </DialogDescription>
                                                    </DialogHeader>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <DialogClose asChild>
                                                            <Button variant="outline" size="lg" className="cursor-pointer">
                                                                Cancel
                                                            </Button>
                                                        </DialogClose>

                                                        <Button variant="destructive" size="lg" className="cursor-pointer"
                                                            onClick={(e) => handleDeleteTeam(e, team.team_id)}
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
                </TabsContent>
                <TabsContent value="events" className="flex flex-col gap-2 p-3 ">
                    <section className="border rounded-lg overflow-hidden">
                        <Table >
                            <TableHeader className="bg-muted">
                                <TableRow>
                                    <TableHead>Team</TableHead>
                                    <TableHead>Event</TableHead>
                                    <TableHead>Department</TableHead>
                                    <TableHead>Sport</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {displayEventTeams?.map((team) => (
                                    <TableRow key={team.team_id}>
                                        <TableCell className="font-medium ">
                                            <div>
                                                {capitalizeFirstLetter(team.name)}
                                            </div>
                                        </TableCell>
                                        <TableCell className="font-medium ">
                                            {capitalizeFirstLetter(events.find(e => e.event_id == team.event_id)?.name) || "--"}
                                        </TableCell>
                                        <TableCell className="font-medium ">
                                            {capitalizeFirstLetter(departments.find(d => d.department_id == team.department_id)?.name) || "--"}
                                        </TableCell>
                                        <TableCell className="font-medium ">
                                            {capitalizeFirstLetter(sports.find(s => s.sport_id == team.sport_id)?.name)}
                                        </TableCell>
                                        <TableCell className="flex gap-2">
                                            <Button variant="outline" size="sm"
                                                onClick={() => navigate(`/ManageTeam/${team.team_id}`)}
                                            >
                                                <Eye />
                                            </Button>
                                            <Button variant="outline" size="sm"  >
                                                <Edit3Icon className=" h-4 w-4" />
                                            </Button>
                                            <Dialog id="teamDeleteDialog">
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
                                                            Are you sure you want to delete this team? <br /> This action cannot be undone.
                                                        </DialogDescription>
                                                    </DialogHeader>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <DialogClose asChild>
                                                            <Button variant="outline" size="lg" className="cursor-pointer">
                                                                Cancel
                                                            </Button>
                                                        </DialogClose>

                                                        <Button variant="destructive" size="lg" className="cursor-pointer"
                                                            onClick={(e) => handleDeleteTeam(e, team.department_id)}
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
                </TabsContent>
                <TabsContent value="departments" className="flex flex-col gap-2 p-3 ">
                    <section className="border rounded-lg overflow-hidden">
                        <Table >
                            <TableHeader className="bg-muted">
                                <TableRow>
                                    <TableHead>Team</TableHead>
                                    <TableHead>Department</TableHead>
                                    <TableHead>Sport</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {displayDepartmentTeams?.map((team) => (
                                    <TableRow key={team.team_id}>
                                        <TableCell className="font-medium ">
                                            <div>
                                                {capitalizeFirstLetter(team.name)}
                                            </div>
                                        </TableCell>
                                        <TableCell className="font-medium ">
                                            {capitalizeFirstLetter(departments.find(d => d.department_id == team.department_id)?.name) || "--"}
                                        </TableCell>
                                        <TableCell className="font-medium ">
                                            {capitalizeFirstLetter(sports.find(s => s.sport_id == team.sport_id)?.name)}
                                        </TableCell>
                                        <TableCell className="flex gap-2">
                                            <Button variant="outline" size="sm"
                                                onClick={() => navigate(`/ManageTeam/${team.team_id}`)}
                                            >
                                                <Eye />
                                            </Button>
                                            <Button variant="outline" size="sm"  >
                                                <Edit3Icon className=" h-4 w-4" />
                                            </Button>
                                            <Dialog id="teamDeleteDialog">
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
                                                            Are you sure you want to delete this team? <br /> This action cannot be undone.
                                                        </DialogDescription>
                                                    </DialogHeader>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <DialogClose asChild>
                                                            <Button variant="outline" size="lg" className="cursor-pointer">
                                                                Cancel
                                                            </Button>
                                                        </DialogClose>

                                                        <Button variant="destructive" size="lg" className="cursor-pointer"
                                                            onClick={(e) => handleDeleteTeam(e, team.department_id)}
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
                </TabsContent>
                <TabsContent value="sports" className="flex flex-col gap-2 p-3 ">
                    <section className="border rounded-lg overflow-hidden">
                        <Table >
                            <TableHeader className="bg-muted">
                                <TableRow>
                                    <TableHead>Team</TableHead>
                                    <TableHead>Sport</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {displaySportTeams?.map((team) => (
                                    <TableRow key={team.team_id}>
                                        <TableCell className="font-medium ">
                                            <div>
                                                {capitalizeFirstLetter(team.name)}
                                            </div>
                                        </TableCell>
                                        <TableCell className="font-medium ">
                                            {capitalizeFirstLetter(sports.find(s => s.sport_id == team.sport_id)?.name)}
                                        </TableCell>
                                        <TableCell className="flex gap-2">
                                            <Button variant="outline" size="sm"
                                                onClick={() => navigate(`/ManageTeam/${team.team_id}`)}
                                            >
                                                <Eye />
                                            </Button>
                                            <Button variant="outline" size="sm"  >
                                                <Edit3Icon className=" h-4 w-4" />
                                            </Button>
                                            <Dialog id="teamDeleteDialog">
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
                                                            Are you sure you want to delete this team? <br /> This action cannot be undone.
                                                        </DialogDescription>
                                                    </DialogHeader>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <DialogClose asChild>
                                                            <Button variant="outline" size="lg" className="cursor-pointer">
                                                                Cancel
                                                            </Button>
                                                        </DialogClose>

                                                        <Button variant="destructive" size="lg" className="cursor-pointer"
                                                            onClick={(e) => handleDeleteTeam(e, team.department_id)}
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
                </TabsContent>
            </Tabs>


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
        </section>

    )

}