import React, { useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useTeamStore } from "@/store/useTeamStore";
import { PageSync } from "@/components/custom/PageSync"
import { ArrowLeft, MapPin, CalendarDays, Activity, FileDigit } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export function TeamProfile() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { teamProfile, profileLoading, fetchTeamProfile } = useTeamStore();

    useEffect(() => {
        if (id) {
            fetchTeamProfile(id);
        }
    }, [id, fetchTeamProfile]);

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
            <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
                <div className="h-32 bg-slate-900 w-full relative">
                    {teamProfile.banner_image && (
                        <img src={teamProfile.banner_image} alt={`${teamProfile.name} banner`} className="object-cover w-full h-full opacity-60" />
                    )}
                </div>
                <div className="px-8 pb-8 pt-6 flex flex-col gap-2">
                    <h1 className="text-3xl text-red font-freshman tracking-widest">
                        {teamProfile.name.toUpperCase()}
                    </h1>

                    <div className="flex flex-wrap gap-x-6 gap-y-2 mt-2 text-sm text-slate-600 font-medium">
                        {teamProfile.sport_name && (
                            <div className="flex items-center gap-1.5 bg-slate-100 px-3 py-1 rounded-full text-slate-800">
                                <Activity size={16} className="text-red" />
                                {teamProfile.sport_name}
                            </div>
                        )}
                        {teamProfile.department_name && (
                            <div className="flex items-center gap-1.5 bg-slate-100 px-3 py-1 rounded-full text-slate-800">
                                <MapPin size={16} className="text-red" />
                                {teamProfile.department_name}
                            </div>
                        )}
                        {teamProfile.event_name && (
                            <div className="flex items-center gap-1.5 bg-slate-100 px-3 py-1 rounded-full text-slate-800">
                                <CalendarDays size={16} className="text-red" />
                                {teamProfile.event_name}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Content Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                <div className="flex flex-col gap-6 lg:col-span-2">
                    {/* Players Roster */}
                    <div className="bg-white border rounded-xl p-6 shadow-sm">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <span className="bg-red-100 text-red-600 p-1.5 rounded-lg">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
                            </span>
                            Player Roster
                        </h2>
                        {players.length === 0 ? (
                            <p className="text-muted-foreground text-sm py-4">No players currently assigned to this team.</p>
                        ) : (
                            <div className="border rounded-lg overflow-hidden">
                                <Table>
                                    <TableHeader className="bg-slate-50">
                                        <TableRow>
                                            <TableHead>Player Name</TableHead>
                                            <TableHead>ID Number</TableHead>
                                            <TableHead>Gender</TableHead>
                                            <TableHead className="text-center">Blood Type</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {players.map((p) => (
                                            <TableRow key={p.player_id}>
                                                <TableCell className="font-semibold">{`${p.first_name} ${p.last_name || ''}`}</TableCell>
                                                <TableCell>{p.id_number || 'N/A'}</TableCell>
                                                <TableCell>{p.gender || 'N/A'}</TableCell>
                                                <TableCell className="text-center text-red-600 font-medium">{p.blood_type || 'N/A'}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </div>

                    {/* Match History */}
                    <div className="bg-white border rounded-xl p-6 shadow-sm">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <span className="bg-blue-100 text-blue-600 p-1.5 rounded-lg">
                                <FileDigit size={20} />
                            </span>
                            Match History
                        </h2>
                        {matches.length === 0 ? (
                            <p className="text-muted-foreground text-sm py-4">No match history found.</p>
                        ) : (
                            <div className="border rounded-lg overflow-hidden">
                                <Table>
                                    <TableHeader className="bg-slate-50">
                                        <TableRow>
                                            <TableHead>Tournament</TableHead>
                                            <TableHead>Opponent</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Result</TableHead>
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
                                                <TableRow key={match.match_id}>
                                                    <TableCell className="font-medium text-sm">
                                                        <div className="flex flex-col">
                                                            <span>{match.tournament_name || "Unknown"}</span>
                                                            <span className="text-xs text-muted-foreground">
                                                                {match.match_name.split(' ')[0]} ({match.date ? new Date(match.date).toLocaleDateString() : 'TBD'})
                                                            </span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="font-medium">
                                                        {opponentName || "TBD"}
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
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column: Tournaments Overview */}
                <div className="flex flex-col gap-6">
                    <div className="bg-white border rounded-xl p-6 shadow-sm">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <span className="bg-emerald-100 text-emerald-600 p-1.5 rounded-lg">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" /><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" /><path d="M4 22h16" /><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" /><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" /><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" /></svg>
                            </span>
                            Tournament Records
                        </h2>
                        <div className="flex flex-col gap-4">
                            {tournaments.length === 0 ? (
                                <p className="text-muted-foreground text-sm align-middle text-center py-6">This team is not enrolled in any tournaments yet.</p>
                            ) : (
                                tournaments.map((t) => (
                                    <div key={t.tournament_id} className="border rounded-lg p-4 bg-slate-50 flex flex-col gap-2 relative shadow-sm hover:border-emerald-200 transition-colors">
                                        <Badge variant="outline" className="w-fit bg-white mb-1">{t.event_name || 'Event'}</Badge>
                                        <h3 className="font-bold text-slate-800 tracking-tight leading-tight">{t.name}</h3>
                                        <p className="text-xs text-muted-foreground uppercase pb-2 border-b">{t.bracketing.replace('-', ' ')}</p>
                                        <Link to={`/ManageTournament/Tournament?t-id=${t.tournament_id}`} className="flex justify-between mt-1 items-center">
                                            <div className="flex flex-col">
                                                <span className="text-xs text-muted-foreground font-semibold">WINS</span>
                                                <span className="text-lg font-black text-green-800 leading-none">{t.wins || 0}</span>
                                            </div>
                                            <div className="w-[1px] h-full bg-slate-200 mx-2"></div>
                                            <div className="flex flex-col text-right">
                                                <span className="text-xs text-muted-foreground font-semibold">LOSSES</span>
                                                <span className="text-lg font-black text-red-800 leading-none">{t.losses || 0}</span>
                                            </div>
                                        </Link>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
