import { useEffect, useState } from "react"
import { usePublicStore } from "@/store/usePublicStore"
import { Link } from "react-router-dom"
import { CalendarDays, MapPin, Trophy, Loader2, Search } from "lucide-react"
import { motion } from "framer-motion"

const formatDate = (date) => {
    if (!date) return "TBD";
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
};

export function PublicEvents() {
    const { publicEvents, fetchPublicEvents, loading } = usePublicStore();
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchPublicEvents();
    }, [fetchPublicEvents]);

    const filteredEvents = publicEvents.filter(event =>
        event.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Separate into upcoming and past events
    const now = new Date();
    const upcomingEvents = filteredEvents.filter(e => new Date(e.end_date || e.start_date) >= now);
    const pastEvents = filteredEvents.filter(e => new Date(e.end_date || e.start_date) < now);

    return (
        <div className="mx-auto my-24 max-w-6xl pt-8 pb-16 px-3 flex flex-col">
            <h1 className="mb-8 border-l-8 border-custom-primary pl-3 font-freshman tracking-wider text-custom-secondary text-2xl">
                EVENTS
            </h1>

            {/* Search */}
            <div className="relative mb-8 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 size-4" />
                <input
                    type="text"
                    placeholder="Search events..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-custom-primary/40 focus:border-custom-primary transition-all"
                />
            </div>

            {loading ? (
                <div className="flex items-center justify-center min-h-[40vh]">
                    <Loader2 className="h-8 w-8 animate-spin text-custom-primary" />
                </div>
            ) : filteredEvents.length === 0 ? (
                <div className="text-center py-20">
                    <Trophy className="mx-auto size-12 text-zinc-300 mb-3" />
                    <p className="text-muted-foreground font-medium">No events found</p>
                </div>
            ) : (
                <div className="flex flex-col gap-12">
                    {/* Upcoming Events */}
                    {upcomingEvents.length > 0 && (
                        <section>
                            <div className="flex items-center gap-3 mb-6">
                                <span className="bg-green-500 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                                    Upcoming
                                </span>
                                <div className="flex-1 h-px bg-zinc-200" />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                {upcomingEvents.map((event, idx) => (
                                    <EventCard key={event.event_id} event={event} idx={idx} />
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Past Events */}
                    {pastEvents.length > 0 && (
                        <section>
                            <div className="flex items-center gap-3 mb-6">
                                <span className="bg-zinc-400 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                                    Past Events
                                </span>
                                <div className="flex-1 h-px bg-zinc-200" />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                {pastEvents.map((event, idx) => (
                                    <EventCard key={event.event_id} event={event} idx={idx} past />
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            )}
        </div>
    );
}

function EventCard({ event, idx, past = false }) {
    const hasBanner = !!event.banner_image;
    
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: idx * 0.08 }}
        >
            <Link
                to={`/Tournaments?event=${event.event_id}`}
                className={`group block rounded-2xl overflow-hidden border border-zinc-200 hover:shadow-xl transition-all duration-300 ${past ? 'opacity-80 hover:opacity-100' : ''}`}
            >
                {/* Banner */}
                <div className={`relative h-44 w-full overflow-hidden ${!hasBanner ? 'bg-gradient-to-br from-custom-secondary via-red-900 to-custom-secondary' : ''}`}>
                    {hasBanner && (
                        <img 
                            src={event.banner_image} 
                            alt={event.name} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                        />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                    {/* Tournament count chip */}
                    <div className="absolute top-3 right-3 bg-custom-primary text-custom-secondary px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-md">
                        <Trophy className="size-3" />
                        {event.tournament_count || 0} Tournament{Number(event.tournament_count) !== 1 ? 's' : ''}
                    </div>

                    {/* Event name overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-5">
                        <h2 className="font-freshman text-xl tracking-wider text-white drop-shadow-lg leading-tight">
                            {event.name?.toUpperCase()}
                        </h2>
                    </div>
                </div>

                {/* Details */}
                <div className="p-4 bg-white flex flex-col gap-2.5">
                    {event.description && (
                        <p className="text-sm text-zinc-600 line-clamp-2">{event.description}</p>
                    )}
                    <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-500">
                        <span className="flex items-center gap-1.5">
                            <CalendarDays className="size-3.5 text-custom-primary" />
                            {formatDate(event.start_date)}
                            {event.end_date && event.end_date !== event.start_date && (
                                <> — {formatDate(event.end_date)}</>
                            )}
                        </span>
                        {event.location && (
                            <span className="flex items-center gap-1.5">
                                <MapPin className="size-3.5 text-custom-primary" />
                                {event.location}
                            </span>
                        )}
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}
