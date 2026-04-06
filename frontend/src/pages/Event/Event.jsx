import { ArrowLeft, MapPin, Edit3Icon, Plus, ArrowUpRight, Users2Icon } from "lucide-react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { PageSync } from "@/components/custom/PageSync";
import { useEventStore } from "@/store/useEventStore";
import { useEffect, useState } from "react";
import sample_bg from "../../assets/sample.jpg"; 
import { formatDateToString } from "@/lib/helpers"; 
import { Button } from "@/components/ui/button";
import { useTournamentStore } from "@/store/useTournamentStore2";
import { useSportsStore } from "@/store/useSportsStore";
import { useTeamStore } from "@/store/useTeamStore";

export function Event() {
    const { eventId } = useParams();
    const navigate = useNavigate();
    const { events, fetchEvents } = useEventStore();
    const { tournaments, fetchTournaments } = useTournamentStore();
    const { sports, fetchSports } = useSportsStore();
    const { teams, fetchTeams } = useTeamStore();


    useEffect(() => {
        fetchTournaments();
        fetchEvents();
        fetchTeams();
        fetchSports();
    }, [fetchEvents, fetchTeams, fetchSports, fetchTournaments]);


    const eventData = events.find(e => e.event_id === eventId);
    const eventTeams = teams.filter(team => team.event_id === eventId);
    const eventTournaments = tournaments.filter(tournament => tournament.event_id === eventId);
    

    return (
        <main className="flex flex-col gap-6">
            <PageSync page="Event Details" />
            <div className="flex items-center justify-between">
                <button onClick={() => navigate(-1) } className=" cursor-pointer ">
                    <ArrowLeft />
                </button>
                <Button variant="outline" onClick={() => navigate(`/events/${eventId}/tournaments`)}>
                    <Edit3Icon className=" h-4 w-4" />
                    Edit Event
                </Button>
            </div>
            
            <div
                className="relative bg-cover bg-center w-full h-[280px] rounded-lg overflow-hidden"
                style={{ backgroundImage: `url(${sample_bg})` }}
            >
                <div className="absolute top-0 right-0 left-0 bottom-0 bg-black opacity-50"></div>
                <div className="absolute top-0 right-0 left-0 bottom-0 flex flex-col items-center justify-center gap-2 drop-shadow-lg">
                    <h1 className="text-white text-3xl font-bold">{eventData?.name || "Event Name"}</h1>
                    
                    <p className="text-white flex items-center gap-2">
                        {eventData?.start_date ? formatDateToString(eventData.start_date) : "Start Date"} 
                        <span>-</span>
                        {eventData?.end_date ? formatDateToString(eventData.end_date) : " End Date"}
                    </p>
                    <p className="text-white flex items-center gap-1">
                        <MapPin className="inline size-4" />
                        {eventData?.location || "Event Location"}
                    </p>
                    
                </div>
            </div>
            <div className="flex flex-col gap-3">
                <div className="flex justify-between">
                    <p className=" text-xl font-semibold ">Teams competing</p>
                    <Link to={`/TeamManagement/CreateTeam`} >
                        <Button variant="outline">
                            <Plus />
                            Add Team 
                        </Button> 
                    </Link>
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                    {eventTeams ? eventTeams?.map(team => (
                        <Link key={team.team_id} to={`/ManageTeam/${team.team_id}`} >
                            <div className="flex flex-col rounded-full py-2 px-4 border text-red-800 bg-red-100/60 border-red-100 shadow-red-50 shadow-lg  hover:shadow-red-100 cursor-pointer w-fit">
                                <p className="text-sm font-medium tabular-nums ">
                                    {team.name}
                                </p>
                            </div>
                        </Link>
                    )) : (
                        <p className="text-muted-foreground mx-auto col-span-2 md:col-span-3">No teams available for this event.</p>
                    ) }
                </div>   
            </div>
           

            <div className="flex justify-between">
                <p className=" text-xl font-semibold ">Tournament(s)</p>
                <Link to={`/ManageTournament/CreateTournament`}>
                    <Button variant="outline">
                        <Plus />
                        Create Tournament 
                    </Button> 
                </Link>
            </div>
            
            <div className=" dark:*:data-[slot=card]:bg-card grid grid-cols-2 gap-4 *:data-[slot=card]:bg-gradient-to-t md:grid-cols-3">
                {eventTournaments?.length > 0 ? eventTournaments?.map( t => (
                    <Link key={t.tournament_id} 
                    to={`/ManageTournament/Tournament?t-id=${t.tournament_id}`}  
                    data-slot="card" className="flex items-center justify-between rounded-2xl py-3 px-5 border bg-white border-red-100 shadow-red-50 shadow-lg hover:bg-white/60 hover:shadow-red-100 cursor-pointer">
                        <div className="flex flex-col items-start justify-between ">
                            <p className="text-lg font-bold tabular-nums text-red">
                                {t.name}
                            </p>
                            <p className="text-muted-foreground text-sm">
                                { sports.find( s => s.sport_id == t.sport_id)?.name || "Sport Name" }
                            </p>
                        </div>
                        <div className="bg-red-50 text-red/80 border border-red-200 rounded-lg p-2"> 
                                <ArrowUpRight className="size-5 " /> 
                        </div>
                    </Link>
                )) : (
                    <p className="text-muted-foreground mx-auto col-span-2 md:col-span-3">No tournaments available for this event.</p>
                )}
            </div>
            

        </main>
    );
}