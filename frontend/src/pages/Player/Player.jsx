import React, { useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { usePlayerStore } from "@/store/usePlayerStore";
import { useSportsStore } from "@/store/useSportsStore";
import { PageSync } from "@/components/custom/PageSync";
import {
    ArrowLeft, MapPin, CalendarDays, Activity, FileDigit,
    Eye, Edit2, Trophy, Users, Info, User, Trash2
} from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Dialog, DialogContent, DialogHeader, DialogTitle,
    DialogTrigger, DialogFooter, DialogDescription
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImageUpload } from "@/components/custom/ImageUpload";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDepartmentStore } from "@/store/useDepartmentStore";
import toast from "react-hot-toast";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from "@/components/ui/sheet";


export function Player() {
    const [searchParams] = useSearchParams();
    const id = searchParams.get("id");

    const navigate = useNavigate();
    const { playerProfile, profileLoading, fetchPlayerProfile, editPlayer, removePlayer } = usePlayerStore();
    const { sports, fetchSports } = useSportsStore();
    const { departments, fetchDepartments } = useDepartmentStore();

    const [isEditSheetOpen, setIsEditSheetOpen] = React.useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
    const [editFormData, setEditFormData] = React.useState({
        first_name: "",
        last_name: "",
        middle_initial: "",
        gender: "",
        student_id: "",
        photo: "",
        sport_id: ""
    });

    useEffect(() => {
        if (id) {
            fetchPlayerProfile(id);
        }
        fetchSports();
        fetchDepartments();
    }, [id, fetchPlayerProfile, fetchSports, fetchDepartments]);

    useEffect(() => {
        if (playerProfile) {
            setEditFormData({
                first_name: playerProfile.first_name || "",
                last_name: playerProfile.last_name || "",
                middle_initial: playerProfile.middle_initial || "",
                gender: playerProfile.gender || "",
                student_id: playerProfile.student_id || "",
                photo: playerProfile.photo || "",
                sport_id: playerProfile.sport_id || ""
            });
        }
    }, [playerProfile]);

    const handleEditSubmit = (e) => {
        e.preventDefault();
        toast.promise(
            editPlayer(id, editFormData),
            {
                loading: "Updating player...",
                success: () => {
                    setIsEditDialogOpen(false);
                    fetchPlayerProfile(id);
                    return "Player updated successfully!";
                },
                error: (error) => {
                    setIsEditDialogOpen(false);
                    return error.message;
                }
            }
        );
    };

    const handleDeletePlayer = async () => {
        const success = await removePlayer(id);
        if (success) {
            setIsDeleteDialogOpen(false);
            navigate(-1);
        }
    };

    if (profileLoading || !playerProfile) {
        return (
            <div className="flex justify-center items-center h-[50vh]">
                <p className="text-muted-foreground animate-pulse">Loading Player Profile...</p>
            </div>
        );
    }

    const { teams = [], tournaments = [], matchParticipations = [] } = playerProfile;

    return (
        <div className="flex flex-col gap-6 pb-12 w-full max-w-6xl mx-auto">
            <PageSync page="Player Profile" />

            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <button onClick={() => navigate(-1)} className="cursor-pointer">
                        <ArrowLeft />
                    </button>
                    <p className="text-lg font-semibold text-muted-foreground">Back</p>
                </div>
                <div className="flex items-center gap-2">
                    <Sheet open={isEditSheetOpen} onOpenChange={setIsEditSheetOpen}>
                        <SheetTrigger asChild>
                            <Button variant="outline" className="gap-2">
                                <Edit2 size={16} />
                                Edit Information
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="overflow-y-auto min-w-[400px]" >
                            <SheetHeader>
                                <SheetTitle>Edit Player Information</SheetTitle>
                                <SheetDescription>
                                    Update the player profile details here. Click save when you are done.
                                </SheetDescription>
                            </SheetHeader>
                            <form onSubmit={handleEditSubmit} className="grid gap-4 py-4 px-3">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="first_name">First Name</Label>
                                        <Input
                                            id="first_name"
                                            value={editFormData.first_name}
                                            onChange={(e) => setEditFormData({ ...editFormData, first_name: e.target.value })}
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="last_name">Last Name</Label>
                                        <Input
                                            id="last_name"
                                            value={editFormData.last_name}
                                            onChange={(e) => setEditFormData({ ...editFormData, last_name: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="middle_initial">Middle Initial</Label>
                                        <Input
                                            id="middle_initial"
                                            value={editFormData.middle_initial}
                                            onChange={(e) => setEditFormData({ ...editFormData, middle_initial: e.target.value })}
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="student_id">Student ID</Label>
                                        <Input
                                            id="student_id"
                                            value={editFormData.student_id}
                                            onChange={(e) => setEditFormData({ ...editFormData, student_id: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="gender">Gender</Label>
                                        <Select
                                            value={editFormData.gender}
                                            onValueChange={(value) => setEditFormData({ ...editFormData, gender: value })}
                                        >
                                            <SelectTrigger className="w-full" >
                                                <SelectValue placeholder="Select gender" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectItem value="male">Male</SelectItem>
                                                    <SelectItem value="female">Female</SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="sport_id">Sport</Label>
                                        <Select
                                            value={editFormData.sport_id}
                                            onValueChange={(value) => setEditFormData({ ...editFormData, sport_id: value })}
                                        >
                                            <SelectTrigger className="w-full" >
                                                <SelectValue placeholder="Select sport" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    {sports.map(sport => (
                                                        <SelectItem key={sport.sport_id} value={sport.sport_id}>
                                                            {sport.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="grid gap-2">
                                    <ImageUpload
                                        label="Player Photo"
                                        folder="players"
                                        defaultImage={editFormData.photo}
                                        onUploadSuccess={(url) => setEditFormData({ ...editFormData, photo: url })}
                                    />
                                </div>
                            </form>
                            <SheetFooter>
                                <Button variant="outline" onClick={() => setIsEditSheetOpen(false)}>Cancel</Button>
                                <Button type="submit" onClick={handleEditSubmit} className="bg-red text-white hover:bg-red/90">Save Changes</Button>
                            </SheetFooter>
                        </SheetContent>
                    </Sheet>

                    <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                        <DialogTrigger asChild>
                            <Button variant="destructive" className="gap-2">
                                <Trash2 size={16} />
                                Delete Player
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Delete Player</DialogTitle>
                                <DialogDescription>
                                    Are you sure you want to delete this player? This action cannot be undone.
                                </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
                                <Button variant="destructive" onClick={handleDeletePlayer}>Delete</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <div className="bg-white border rounded-2xl overflow-hidden shadow-md ring-1 ring-slate-200">
                <div className="h-40 bg-gradient-to-r from-red-900 via-red-800 to-slate-900 w-full relative flex items-center justify-center">
                    <User size={64} className="text-white/20" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute bottom-6 left-8 flex items-end gap-4">
                        <Avatar className="w-20 h-20 border-4 border-white shadow-lg">
                            <AvatarImage src={playerProfile.photo} alt={playerProfile.first_name} className="object-cover" />
                            <AvatarFallback className="text-2xl bg-red text-white">
                                {playerProfile.first_name?.[0]}{playerProfile.last_name?.[0]}
                            </AvatarFallback>
                        </Avatar>
                        <div className="mb-2">
                            <h1 className="text-3xl text-white font-bold drop-shadow-lg">
                                {playerProfile.first_name} {playerProfile.middle_initial && `${playerProfile.middle_initial}.`} {playerProfile.last_name}
                            </h1>
                        </div>
                    </div>
                </div>
                <div className="px-8 py-6 flex flex-col gap-4">
                    <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-600 font-medium">
                        {playerProfile.sport_name && (
                            <div className="flex items-center gap-1.5 bg-red-50 px-4 py-2 rounded-lg text-red border border-red-100">
                                <Activity size={18} className="text-red" />
                                <span className="font-bold uppercase tracking-tight">{playerProfile.sport_name}</span>
                            </div>
                        )}
                        {playerProfile.student_id && (
                            <div className="flex items-center gap-1.5 bg-slate-50 px-4 py-2 rounded-lg text-slate-700 border border-slate-100">
                                <Info size={18} className="text-slate-500" />
                                ID: {playerProfile.student_id}
                            </div>
                        )}
                        {playerProfile.gender && (
                            <div className="flex items-center gap-1.5 bg-slate-50 px-4 py-2 rounded-lg text-slate-700 border border-slate-100">
                                <User size={18} className="text-slate-500" />
                                {playerProfile.gender}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-8">
                {teams.length > 0 && (
                    <div className="bg-white border rounded-2xl p-6 shadow-sm ring-1 ring-slate-200">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <span className="bg-blue-50 text-blue-600 p-2 rounded-xl">
                                    <Users size={20} />
                                </span>
                                Team Affiliations
                            </h2>
                            <Badge variant="outline" className="px-3 py-1 font-semibold text-blue-700 bg-blue-50 border-blue-100">
                                {teams.length} Team{teams.length !== 1 ? 's' : ''}
                            </Badge>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {teams.map((team) => (
                                <div key={team.team_id} className="bg-slate-50 border border-slate-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-bold text-slate-800">{team.name}</h3>
                                        <Link to={`/Admin/ManageTeam?id=${team.team_id}`}>
                                            <Eye size={16} className="text-slate-400 hover:text-blue-500 cursor-pointer" />
                                        </Link>
                                    </div>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {team.event_name && (
                                            <Badge variant="secondary" className="text-xs">
                                                {team.event_name}
                                            </Badge>
                                        )}
                                        {team.department_name && (
                                            <Badge variant="outline" className="text-xs">
                                                {team.department_name}
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {tournaments.length > 0 && (
                    <div className="bg-white border rounded-2xl p-6 shadow-sm ring-1 ring-slate-200">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <span className="bg-emerald-100 text-emerald-600 p-2 rounded-xl">
                                    <Trophy size={20} />
                                </span>
                                Tournament Participations
                            </h2>
                            <Badge variant="outline" className="px-3 py-1 font-semibold text-emerald-700 bg-emerald-50 border-emerald-100">
                                {tournaments.length} Tournament{tournaments.length !== 1 ? 's' : ''}
                            </Badge>
                        </div>
                        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                            {tournaments.map((t) => (
                                <div key={t.tournament_id} className="min-w-[280px] bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all group shrink-0">
                                    <div className="flex justify-between items-start mb-3">
                                        <Badge variant="outline" className="bg-slate-50 text-[10px] text-slate-500 font-bold uppercase truncate max-w-[150px]">{t.event_name || 'Event'}</Badge>
                                        <Link to={`/Admin/ManageTournament/Tournament?t-id=${t.tournament_id}`} className="text-slate-400 group-hover:text-emerald-500 transition-colors">
                                            <Eye size={16} />
                                        </Link>
                                    </div>
                                    <h3 className="font-bold text-slate-800 text-lg leading-tight mb-1">{t.name}</h3>
                                    <p className="text-[11px] text-muted-foreground uppercase font-bold tracking-wider pb-3 border-b mb-4">{t.bracketing?.replace('-', ' ') || 'SINGLE ELIMINATION'}</p>

                                    <div className="flex items-center justify-between bg-slate-50 rounded-lg p-3">
                                        <div className="flex flex-col items-center">
                                            <span className="text-[10px] text-slate-400 font-bold tracking-tighter uppercase">Wins</span>
                                            <span className="text-2xl font-black text-emerald-600 leading-none">{t.wins || 0}</span>
                                        </div>
                                        <div className="w-[1px] h-8 bg-slate-200"></div>
                                        <div className="flex flex-col items-center">
                                            <span className="text-[10px] text-slate-400 font-bold tracking-tighter uppercase">Losses</span>
                                            <span className="text-2xl font-black text-rose-600 leading-none">{t.losses || 0}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="bg-white border rounded-2xl p-6 shadow-sm ring-1 ring-slate-200">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <span className="bg-blue-50 text-blue-600 p-2 rounded-xl">
                                <FileDigit size={20} />
                            </span>
                            Match History
                        </h2>
                    </div>

                    {matchParticipations.length === 0 ? (
                        <div className="text-center py-10 bg-slate-50 rounded-xl border border-dashed">
                            <p className="text-muted-foreground text-sm">No match history found.</p>
                        </div>
                    ) : (
                        <div className="border rounded-xl overflow-hidden shadow-sm">
                            <Table>
                                <TableHeader className="bg-slate-50/80 backdrop-blur-sm">
                                    <TableRow>
                                        <TableHead className="font-bold">Match Name</TableHead>
                                        <TableHead className="font-bold">Sport</TableHead>
                                        <TableHead className="font-bold">Team</TableHead>
                                        <TableHead className="font-bold">Opponent</TableHead>
                                        <TableHead className="font-bold">Status</TableHead>
                                        <TableHead className="font-bold">Result</TableHead>
                                        <TableHead className="text-right font-bold">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {matchParticipations.map((match) => {
                                        let resultVariant = "secondary";
                                        if (match.result === 'Win') resultVariant = "default";
                                        else if (match.result === 'Loss') resultVariant = "destructive";

                                        return (
                                            <TableRow key={match.match_id} className="hover:bg-slate-50/50 transition-colors">
                                                <TableCell className="font-bold text-slate-700">
                                                    <div className="flex flex-col">
                                                        <span className="truncate max-w-[200px]">{match.match_name || "Match"}</span>
                                                        <span className="text-[10px] text-slate-400 font-mono uppercase tracking-widest leading-none mt-1">
                                                            {match.date ? new Date(match.date).toLocaleDateString() : 'DATE TBD'}
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline" className="text-xs bg-red-50 text-red border-red-100">
                                                        {match.sport_name || 'N/A'}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-slate-600">
                                                    {match.team_name || 'N/A'}
                                                </TableCell>
                                                <TableCell className="text-slate-600 italic">
                                                    {match.opponent_name || "TBD"}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                                                        <div className={`w-1.5 h-1.5 rounded-full ${match.is_finished ? 'bg-slate-300' : 'bg-green-500 animate-pulse'}`} />
                                                        {match.is_finished ? "Completed" : "Active"}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant={resultVariant} className={`text-xs font-semibold uppercase ${resultVariant === 'default' ? 'bg-emerald-500 hover:bg-emerald-600' : ''}`}>
                                                        {match.result}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Link to={`/Admin/Sports/${match.sport_name?.toLowerCase()}/scoring?m-id=${match.match_id}`}>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 bg-blue-50">
                                                            <Eye size={14} />
                                                        </Button>
                                                    </Link>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
