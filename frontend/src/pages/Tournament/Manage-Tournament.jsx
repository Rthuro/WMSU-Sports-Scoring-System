import { PageSync } from "@/components/custom/PageSync"
import { Card, CardHeader, CardFooter, CardTitle } from "@/components/ui/card";
import { CalendarClock, ArrowRight, RefreshCw, ArrowUpRight } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";
import { useTournamentStore } from "@/store/useTournamentStore2";
import { Button } from "@/components/ui/button";
import { useEventStore } from "@/store/useEventStore";

export function ManageTournament(){
    const { tournaments, fetchTournaments } = useTournamentStore();
    const { events } = useEventStore();
    
    
    return <>
        <PageSync page="Manage Tournament" />
        <div className=" dark:*:data-[slot=card]:bg-card grid grid-cols-2 gap-3  @xl/main:grid-cols-2 @5xl/main:grid-cols-3 ">
            <Card className="@container/card bg-white shadow-md border border-red-100 shadow-red-50 hover:shadow-lg cursor-pointer">
                <CardHeader>
                    <CardTitle className="flex items-center gap-3 tabular-nums ">
                        <div className="bg-red-50 text-red border border-red-200 rounded-lg p-3"> 
                        <CalendarClock className="size-5 " /> 
                    </div>
                    <div>
                        <p className="text-lg @[250px]/card:text-xl font-semibold">
                        {tournaments.length}
                        </p>
                        <p className="text-accent-foreground text-sm font-normal">Tournament(s)</p>
                    </div>
                    </CardTitle>
                </CardHeader>
                <CardFooter className="flex-col flex gap-3">
                    <Separator />
                    <Link to="/ManageTournament/CreateTournament" className="flex items-center justify-between w-full text-red text-sm">
                        <p>Create Tournament</p>
                        <ArrowRight className="size-4 " /> 
                    </Link>
                </CardFooter>   
            </Card>
        </div>    
        
        <Separator />


        <div className="flex items-center justify-between">
            <p className=" text-2xl font-semibold ">Tournament(s)</p>
            <Button variant="outline" className="w-fit flex self-end" onClick={fetchTournaments}>
                <RefreshCw className="size-4" />
                Refresh
            </Button>
        </div>
        
        <div className=" dark:*:data-[slot=card]:bg-card grid grid-cols-2 gap-4 *:data-[slot=card]:bg-gradient-to-t md:grid-cols-3">
            {tournaments.length > 0 ? tournaments?.map( t => (
                <Link key={t.tournament_id} 
                to={`/ManageTournament/Tournament?t-id=${t.tournament_id}`}  
                data-slot="card" className="flex items-start justify-between rounded-2xl py-3 px-5 border bg-white border-red-100 shadow-red-50 shadow-lg hover:bg-white/60 hover:shadow-red-100 cursor-pointer">
                    <div className="flex flex-col items-start justify-between ">
                        <p className="text-lg font-bold tabular-nums text-red">
                            {t.name}
                        </p>
                        <p className="text-muted-foreground text-sm">
                            {  events.find(e => e.event_id === t?.event_id)?.name || "" }
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

        
  </> 
}