import React, { useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { useTeamStore } from "@/store/useTeamStore";
import { PageSync } from "@/components/custom/PageSync"
import {
    ArrowLeft, MapPin, CalendarDays, Activity, FileDigit,
    Eye, Edit2, Settings2, Trophy, Users, Info
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
import { useSportsStore } from "@/store/useSportsStore";
import { ImageUpload } from "@/components/custom/ImageUpload";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { adminRoute } from "@/lib/helpers";

export function TeamProfile() {
    const [searchParams] = useSearchParams();
    const type = searchParams.get("type");
    const id = searchParams.get("id");

    const navigate = useNavigate();
    const { teamProfile, profileLoading, fetchTeamProfile, updateTeam } = useTeamStore();
    const { sports, fetchSports } = useSportsStore();

    const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
    const [editFormData, setEditFormData] = React.useState({
        name: "",
        sport_id: "",
        department_name: "",
        banner_image: "",
    });

    useEffect(() => {
        if (id) {
            fetchTeamProfile(type, id);
        }
        fetchSports();
    }, [id, fetchTeamProfile, fetchSports]);

    useEffect(() => {
        if (teamProfile) {
            setEditFormData({
                name: teamProfile.name || "",
                sport_id: teamProfile.sport_id || "",
                department_name: teamProfile.department_name || "",
                banner_image: teamProfile.banner_image || "",
            });
        }
    }, [teamProfile]);

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        const success = await updateTeam(id, editFormData);
        if (success) {
            setIsEditDialogOpen(false);
        }
    };

    if (profileLoading || !teamProfile) {
        return (
            <div className="flex justify-center items-center h-[50vh]">
                <p className="text-muted-foreground animate-pulse">Loading Team Profile...</p>
            </div>
        );
    }

    const { players = [], tournaments = [], matches = [] } = teamProfile;

    return (
        <div className="flex flex-col gap-6 pb-12 w-full max-w-6xl mx-auto">
            <PageSync page="Team Profile" />

            <div className="flex items-center gap-3">
                <button onClick={() => navigate(-1)} className="cursor-pointer">
                    <ArrowLeft />
                </button>
                <p className="text-lg font-semibold text-muted-foreground">Back</p>
            </div>

            {/* Profile Header Block */}
            <div className="bg-white border rounded-2xl overflow-hidden shadow-md ring-1 ring-slate-200">
                <div className="h-40 bg-slate-900 w-full relative">
                    {teamProfile.banner_image ? (
                        <img src={teamProfile.banner_image} alt={`${teamProfile.name} banner`} className="object-cover w-full h-full opacity-70" />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-r from-red-900 via-red-800 to-slate-900 flex items-center justify-center">
                            <Trophy size={64} className="text-white/20" />
                        </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute bottom-6 left-8">
                        <h1 className="text-4xl text-white font-freshman tracking-widest drop-shadow-lg">
                            {teamProfile.name.toUpperCase()}
                        </h1>
                    </div>

                    <div className="absolute top-6 right-8">
                        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                            <DialogTrigger asChild>
                                <Button variant="secondary" className="gap-2 bg-white/10 hover:bg-white/20 text-white border-white/20 backdrop-blur-md">
                                    <Edit2 size={16} />
                                    Edit Information
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle>Edit Team Information</DialogTitle>
                                    <DialogDescription>
                                        Update the team profile details here. Click save when you're done.
                                    </DialogDescription>
                                </DialogHeader>
                                <form onSubmit={handleEditSubmit} className="grid gap-4 py-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="name">Team Name</Label>
                                        <Input
                                            id="name"
                                            value={editFormData.name}
                                            onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                                            className="col-span-3"
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="department">Department</Label>
                                        <Input
                                            id="department"
                                            value={editFormData.department_name}
                                            onChange={(e) => setEditFormData({ ...editFormData, department_name: e.target.value })}
                                            className="col-span-3"
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <ImageUpload
                                            label="Team Banner"
                                            folder="teams"
                                            defaultImage={editFormData.banner_image}
                                            onUploadSuccess={(url) => setEditFormData({ ...editFormData, banner_image: url })}
                                        />
                                    </div>
                                </form>
                                <DialogFooter>
                                    <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
                                    <Button type="submit" onClick={handleEditSubmit} className="bg-red text-white hover:bg-red/90">Save Changes</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
                <div className="px-8 py-6 flex flex-col gap-4">
                    <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-600 font-medium">
                        {teamProfile.sport_name && (
                            <div className="flex items-center gap-1.5 bg-red-50 px-4 py-2 rounded-lg text-red border border-red-100">
                                <Activity size={18} className="text-red" />
                                <span className="font-bold uppercase tracking-tight">{teamProfile.sport_name}</span>
                            </div>
                        )}
                        {teamProfile.department_name && (
                            <div className="flex items-center gap-1.5 bg-slate-50 px-4 py-2 rounded-lg text-slate-700 border border-slate-100">
                                <MapPin size={18} className="text-slate-500" />
                                {teamProfile.department_name}
                            </div>
                        )}
                        {teamProfile.event_name && (
                            <div className="flex items-center gap-1.5 bg-slate-50 px-4 py-2 rounded-lg text-slate-700 border border-slate-100">
                                <CalendarDays size={18} className="text-slate-500" />
                                {teamProfile.event_name}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Section 2: Tournament Records (Horizontal Scroll) */}
            {tournaments.length > 0 && (
                <div className="bg-white border rounded-2xl p-6 shadow-sm ring-1 ring-slate-200">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <span className="bg-emerald-100 text-emerald-600 p-2 rounded-xl">
                                <Trophy size={20} />
                            </span>
                            Tournament Records
                        </h2>
                        <Badge variant="outline" className="px-3 py-1 font-semibold text-emerald-700 bg-emerald-50 border-emerald-100">
                            {tournaments.length} Active Participation{tournaments.length !== 1 ? 's' : ''}
                        </Badge>
                    </div>

                    {tournaments.length === 0 ? (
                        <div className="text-center py-10 bg-slate-50 rounded-xl border border-dashed">
                            <p className="text-muted-foreground">This team is not enrolled in any tournaments yet.</p>
                        </div>
                    ) : (
                        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                            {tournaments.map((t) => (
                                <div key={t.tournament_id} className="min-w-[280px] bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all group shrink-0">
                                    <div className="flex justify-between items-start mb-3">
                                        <Badge variant="outline" className="bg-slate-50 text-[10px] text-slate-500 font-bold uppercase truncate max-w-[150px]">{t.event_name || 'Event'}</Badge>
                                        <Link to={adminRoute(`ManageTournament/Tournament?t-id=${t.tournament_id}`)} className="text-slate-400 group-hover:text-emerald-500 transition-colors">
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
                    )}
                </div>
            )}

            <div className="grid grid-cols-1 gap-8">
                {/* Section 3: Player Roster */}
                <div className="bg-white border rounded-2xl p-6 shadow-sm ring-1 ring-slate-200">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <span className="bg-red-50 text-red p-2 rounded-xl">
                                <Users size={20} />
                            </span>
                            Player Roster
                        </h2>
                        <Button variant="outline" size="sm" className="gap-2 text-xs h-8">
                            <Settings2 size={14} />
                            Manage Roster
                        </Button>
                    </div>

                    {players.length === 0 ? (
                        <div className="text-center py-10 bg-slate-50 rounded-xl border border-dashed">
                            <p className="text-muted-foreground text-sm">No players currently assigned to this team.</p>
                        </div>
                    ) : (
                        <div className="border rounded-xl overflow-hidden shadow-sm">
                            <Table>
                                <TableHeader className="bg-slate-50/80 backdrop-blur-sm sticky top-0">
                                    <TableRow>
                                        <TableHead className="font-bold">Player Name</TableHead>
                                        <TableHead className="font-bold">ID Number</TableHead>
                                        <TableHead className="font-bold">Gender</TableHead>
                                        <TableHead className="text-center font-bold">Blood Type</TableHead>
                                        <TableHead className="text-right font-bold">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {players.map((p) => (
                                        <TableRow key={p.player_id} className="hover:bg-slate-50/50 ">
                                            <TableCell className="font-bold text-slate-700">
                                                <div className="flex items-center gap-2">
                                                    <Avatar className="w-10 h-10">
                                                        <AvatarImage
                                                            src={p.photo}
                                                            alt={p.first_name}
                                                        />
                                                        <AvatarFallback>{p.first_name[0]}{p.last_name?.[0]}</AvatarFallback>
                                                    </Avatar>
                                                    {`${p.first_name} ${p.last_name || ''}`}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-slate-500 font-mono text-xs">{p.id_number || 'N/A'}</TableCell>
                                            <TableCell>
                                                <Badge variant="secondary" className="bg-slate-100 text-slate-600 hover:bg-slate-100 border-none px-2 py-0">
                                                    {p.gender || 'N/A'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <span className="bg-red-50 text-red font-black text-xs px-2 py-1 rounded-md border border-red-100">
                                                    {p.blood_type || 'N/A'}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-1">
                                                    <Link to={adminRoute(`Player/?id=${p.player_id}`)}>
                                                        <Button size="icon" className="h-8 w-8 text-blue-600 bg-blue-50 hover:bg-blue-100">
                                                            <Eye size={14} />
                                                        </Button>
                                                    </Link>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </div>

                {/* Section 4: Match Records */}
                <div className="bg-white border rounded-2xl p-6 shadow-sm ring-1 ring-slate-200">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <span className="bg-blue-50 text-blue-600 p-2 rounded-xl">
                                <FileDigit size={20} />
                            </span>
                            Match History
                        </h2>
                    </div>

                    {matches.length === 0 ? (
                        <div className="text-center py-10 bg-slate-50 rounded-xl border border-dashed">
                            <p className="text-muted-foreground text-sm">No match history found.</p>
                        </div>
                    ) : (
                        <div className="border rounded-xl overflow-hidden shadow-sm">
                            <Table>
                                <TableHeader className="bg-slate-50/80 backdrop-blur-sm">
                                    <TableRow>
                                        <TableHead className="font-bold">Match Name</TableHead>
                                        <TableHead className="font-bold">Opponent</TableHead>
                                        <TableHead className="font-bold">Type</TableHead>
                                        <TableHead className="font-bold">Status</TableHead>
                                        <TableHead className="font-bold">Result</TableHead>
                                        <TableHead className="text-right font-bold">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {matches.map((match) => {
                                        const isTeamA = match.team_a_id == id;
                                        const opponentName = isTeamA ? match.team_b_name : match.team_a_name;

                                        let result = "Pending";
                                        let variant = "secondary";

                                        if (match.is_finished || match.winner_id != null) {
                                            if (match.winner_id == id) {
                                                result = "Win";
                                                variant = "default";
                                            } else if (match.winner_id != null) {
                                                result = "Loss";
                                                variant = "destructive";
                                            } else {
                                                result = "Draw / TBD";
                                                variant = "outline";
                                            }
                                        }

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
                                                <TableCell className="font-semibold text-slate-600 italic">
                                                    {opponentName || "TBD"}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline" className="text-[10px] px-2 py-0 border border-emerald-100 bg-emerald-50 text-emerald-700">
                                                        {type == 'tournament' ? 'Tournament' : 'Regular'}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                                                        <div className={`w-1.5 h-1.5 rounded-full ${match.is_finished ? 'bg-slate-300' : 'bg-green-500 animate-pulse'}`} />
                                                        {match.is_finished ? "Completed" : "Active"}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant={variant} className={`text-[10px] font-semibold uppercase ${variant === 'default' ? 'bg-emerald-500 hover:bg-emerald-600' : ''}`}>
                                                        {result}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Link to={adminRoute(`Sports/${teamProfile.sport_name}/scoring?m-id=${match.match_id}`)}>
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
