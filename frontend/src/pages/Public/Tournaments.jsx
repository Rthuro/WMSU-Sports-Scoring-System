import { useEffect, useState, useMemo } from "react"
import { usePublicStore } from "@/store/usePublicStore"
import { useSearchParams } from "react-router-dom"
import { Trophy, Loader2, Search, Medal, ChevronDown, ChevronUp, Swords } from "lucide-react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { motion, AnimatePresence } from "framer-motion"
import wmsuLogo from '@/assets/logo/Western_Mindanao_State_University.png'

const MEDAL_COLORS = [
    "from-amber-400 to-yellow-500",     // gold
    "from-slate-300 to-slate-400",       // silver
    "from-amber-600 to-amber-700",       // bronze
];

const MEDAL_RING = [
    "ring-amber-400/50",
    "ring-slate-300/50",
    "ring-amber-600/50",
];

const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

export function PublicTournaments() {
    const [searchParams] = useSearchParams();
    const eventFilter = searchParams.get("event");
    
    const { publicTournaments, publicTally, fetchPublicTournaments, loading } = usePublicStore();
    const [searchTerm, setSearchTerm] = useState("");
    const [expandedId, setExpandedId] = useState(null);

    useEffect(() => {
        fetchPublicTournaments();
    }, [fetchPublicTournaments]);

    // Auto-expand first tournament if coming from event link
    useEffect(() => {
        if (eventFilter && publicTournaments.length > 0) {
            const first = publicTournaments.find(t => t.event_id === eventFilter);
            if (first) setExpandedId(first.tournament_id);
        }
    }, [eventFilter, publicTournaments]);

    const filteredTournaments = useMemo(() => {
        let list = publicTournaments;
        if (eventFilter) {
            list = list.filter(t => t.event_id === eventFilter);
        }
        if (searchTerm) {
            const q = searchTerm.toLowerCase();
            list = list.filter(t =>
                t.name?.toLowerCase().includes(q) ||
                t.sport_name?.toLowerCase().includes(q) ||
                t.event_name?.toLowerCase().includes(q)
            );
        }
        return list;
    }, [publicTournaments, eventFilter, searchTerm]);

    const getTally = (tournamentId) => {
        return publicTally
            .filter(t => t.tournament_id === tournamentId)
            .sort((a, b) => {
                if (b.wins !== a.wins) return b.wins - a.wins;
                return a.losses - b.losses;
            });
    };

    const toggleExpand = (id) => {
        setExpandedId(prev => prev === id ? null : id);
    };

    return (
        <div className="mx-auto my-24 max-w-6xl pt-8 pb-16 px-3 flex flex-col">
            <h1 className="mb-8 border-l-8 border-custom-primary pl-3 font-freshman tracking-wider text-custom-secondary text-2xl">
                TOURNAMENTS
            </h1>

            {/* Search */}
            <div className="relative mb-8 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 size-4" />
                <input
                    type="text"
                    placeholder="Search tournaments..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-custom-primary/40 focus:border-custom-primary transition-all"
                />
            </div>

            {loading ? (
                <div className="flex items-center justify-center min-h-[40vh]">
                    <Loader2 className="h-8 w-8 animate-spin text-custom-primary" />
                </div>
            ) : filteredTournaments.length === 0 ? (
                <div className="text-center py-20">
                    <Trophy className="mx-auto size-12 text-zinc-300 mb-3" />
                    <p className="text-muted-foreground font-medium">No tournaments found</p>
                </div>
            ) : (
                <div className="flex flex-col gap-5">
                    {filteredTournaments.map((tournament, idx) => {
                        const tally = getTally(tournament.tournament_id);
                        const isExpanded = expandedId === tournament.tournament_id;

                        return (
                            <motion.div
                                key={tournament.tournament_id}
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.35, delay: idx * 0.06 }}
                                className="rounded-2xl border border-zinc-200 overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow"
                            >
                                {/* Tournament Header — clickable */}
                                <button
                                    onClick={() => toggleExpand(tournament.tournament_id)}
                                    className="w-full cursor-pointer"
                                >
                                    <div className="relative">
                                        {/* Header gradient bar */}
                                        <div className="h-2 bg-gradient-to-r from-custom-secondary via-red-800 to-custom-primary" />
                                        
                                        <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-3">
                                            <div className="flex items-start gap-4">
                                                <div className="bg-custom-primary/10 p-2.5 rounded-xl shrink-0">
                                                    <Trophy className="size-6 text-custom-primary" />
                                                </div>
                                                <div className="text-left">
                                                    <h2 className="font-freshman text-lg tracking-wider text-custom-secondary leading-tight">
                                                        {tournament.name?.toUpperCase()}
                                                    </h2>
                                                    <div className="flex flex-wrap items-center gap-2 mt-1.5">
                                                        {tournament.sport_name && (
                                                            <span className="bg-custom-secondary text-custom-primary text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                                                                {tournament.sport_name}
                                                            </span>
                                                        )}
                                                        {tournament.event_name && (
                                                            <span className="bg-zinc-100 text-zinc-600 text-[10px] font-medium px-2.5 py-0.5 rounded-full">
                                                                {tournament.event_name}
                                                            </span>
                                                        )}
                                                        {tournament.bracketing && (
                                                            <span className="bg-zinc-100 text-zinc-500 text-[10px] font-medium px-2.5 py-0.5 rounded-full uppercase">
                                                                {tournament.bracketing.replace('-', ' ')}
                                                            </span>
                                                        )}
                                                    </div>
                                                    {(tournament.start_date || tournament.location) && (
                                                        <p className="text-xs text-zinc-400 mt-1.5">
                                                            {formatDate(tournament.start_date)}
                                                            {tournament.end_date && tournament.end_date !== tournament.start_date && ` — ${formatDate(tournament.end_date)}`}
                                                            {tournament.location && ` · ${tournament.location}`}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3 shrink-0">
                                                <div className="flex items-center gap-1 text-xs text-zinc-500 bg-zinc-50 px-3 py-1.5 rounded-full">
                                                    <Swords className="size-3.5" />
                                                    <span className="font-semibold">{tally.length}</span> Teams
                                                </div>
                                                {isExpanded ? (
                                                    <ChevronUp className="size-5 text-zinc-400" />
                                                ) : (
                                                    <ChevronDown className="size-5 text-zinc-400" />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </button>

                                {/* Tally Content — expandable */}
                                <AnimatePresence>
                                    {isExpanded && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3, ease: "easeInOut" }}
                                            className="overflow-hidden"
                                        >
                                            <div className="border-t border-zinc-100 px-5 pb-5">
                                                {tally.length === 0 ? (
                                                    <p className="text-center text-sm text-zinc-400 py-8">No tally data yet</p>
                                                ) : (
                                                    <>
                                                        {/* Top 3 Podium */}
                                                        {tally.length >= 2 && (
                                                            <div className="flex items-end justify-center gap-3 md:gap-6 py-6">
                                                                {/* 2nd place */}
                                                                {tally[1] && (
                                                                    <PodiumCard team={tally[1]} rank={2} />
                                                                )}
                                                                {/* 1st place */}
                                                                {tally[0] && (
                                                                    <PodiumCard team={tally[0]} rank={1} />
                                                                )}
                                                                {/* 3rd place */}
                                                                {tally[2] && (
                                                                    <PodiumCard team={tally[2]} rank={3} />
                                                                )}
                                                            </div>
                                                        )}

                                                        {/* Full standings list */}
                                                        <div className="bg-zinc-50 rounded-xl overflow-hidden">
                                                            <div className="grid grid-cols-12 gap-2 px-4 py-2.5 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                                                                <div className="col-span-1 text-center">#</div>
                                                                <div className="col-span-5">Team</div>
                                                                <div className="col-span-2 text-center">Wins</div>
                                                                <div className="col-span-2 text-center">Losses</div>
                                                                <div className="col-span-2 text-center">Win %</div>
                                                            </div>
                                                            {tally.map((team, tIdx) => {
                                                                const totalGames = team.wins + team.losses;
                                                                const winPct = totalGames > 0 ? ((team.wins / totalGames) * 100).toFixed(0) : "—";
                                                                
                                                                return (
                                                                    <motion.div
                                                                        key={team.team_id}
                                                                        initial={{ opacity: 0, x: -10 }}
                                                                        animate={{ opacity: 1, x: 0 }}
                                                                        transition={{ delay: tIdx * 0.05 }}
                                                                        className={`grid grid-cols-12 gap-2 px-4 py-3 items-center border-t border-zinc-100 ${tIdx < 3 ? 'bg-white' : ''}`}
                                                                    >
                                                                        <div className="col-span-1 text-center">
                                                                            {tIdx < 3 ? (
                                                                                <span className={`inline-flex items-center justify-center size-6 rounded-full bg-gradient-to-br ${MEDAL_COLORS[tIdx]} text-white text-[10px] font-black shadow-sm`}>
                                                                                    {tIdx + 1}
                                                                                </span>
                                                                            ) : (
                                                                                <span className="text-sm text-zinc-400 font-semibold">{tIdx + 1}</span>
                                                                            )}
                                                                        </div>
                                                                        <div className="col-span-5 flex items-center gap-2.5">
                                                                            <Avatar className="size-8 rounded-lg border border-zinc-200">
                                                                                <AvatarImage src={team.team_logo || wmsuLogo} />
                                                                                <AvatarFallback className="text-[10px] rounded-lg">{team.team_name?.[0]}</AvatarFallback>
                                                                            </Avatar>
                                                                            <div>
                                                                                <p className="text-sm font-semibold text-zinc-800 leading-tight">{team.team_name}</p>
                                                                                {team.department_name && (
                                                                                    <p className="text-[10px] text-zinc-400 leading-tight">{team.department_name}</p>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-span-2 text-center">
                                                                            <span className="text-sm font-bold text-emerald-600">{team.wins}</span>
                                                                        </div>
                                                                        <div className="col-span-2 text-center">
                                                                            <span className="text-sm font-bold text-rose-500">{team.losses}</span>
                                                                        </div>
                                                                        <div className="col-span-2 text-center">
                                                                            <span className={`text-sm font-bold ${winPct !== "—" && Number(winPct) >= 50 ? 'text-emerald-600' : 'text-zinc-400'}`}>
                                                                                {winPct !== "—" ? `${winPct}%` : winPct}
                                                                            </span>
                                                                        </div>
                                                                    </motion.div>
                                                                );
                                                            })}
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

function PodiumCard({ team, rank }) {
    const sizes = {
        1: { card: "w-28 md:w-36", avatar: "size-16 md:size-20", bar: "h-24 md:h-28" },
        2: { card: "w-24 md:w-32", avatar: "size-12 md:size-16", bar: "h-16 md:h-20" },
        3: { card: "w-24 md:w-32", avatar: "size-12 md:size-16", bar: "h-12 md:h-14" },
    };
    
    const s = sizes[rank];
    const medalIdx = rank - 1;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: rank === 1 ? 0.1 : rank === 2 ? 0.2 : 0.3 }}
            className={`flex flex-col items-center ${s.card}`}
        >
            <div className="relative mb-2">
                <Avatar className={`${s.avatar} border-2 ${MEDAL_RING[medalIdx]} ring-4 ${MEDAL_RING[medalIdx]} shadow-lg`}>
                    <AvatarImage src={team.team_logo || wmsuLogo} />
                    <AvatarFallback className="text-lg font-bold">{team.team_name?.[0]}</AvatarFallback>
                </Avatar>
                {rank === 1 && (
                    <div className="absolute -top-3 -right-1">
                        <Medal className="size-6 text-amber-500 drop-shadow" />
                    </div>
                )}
            </div>
            <p className="text-xs font-bold text-zinc-800 text-center leading-tight truncate w-full">{team.team_name}</p>
            <p className="text-[10px] text-zinc-400 mb-2">{team.wins}W - {team.losses}L</p>
            <div className={`w-full ${s.bar} bg-gradient-to-t ${MEDAL_COLORS[medalIdx]} rounded-t-lg flex items-start justify-center pt-2`}>
                <span className="text-white font-freshman text-lg drop-shadow">{rank}</span>
            </div>
        </motion.div>
    );
}
