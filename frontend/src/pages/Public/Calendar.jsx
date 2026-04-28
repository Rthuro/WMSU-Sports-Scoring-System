import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useSportsStore } from "@/store/useSportsStore"
import { useDepartmentStore } from "@/store/useDepartmentStore"
import { useMatchStore } from "@/store/useMatchStore"
import { ChevronDown, ChevronsRight, ChevronsLeft, Dot, Loader2, Trophy , MapPin} from 'lucide-react'
import { formatDateToString } from "@/lib/helpers"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import wmsuLogo from '@/assets/logo/Western_Mindanao_State_University.png'
import { usePublicStore } from "@/store/usePublicStore"

const formatDate = (date) => {
    const d = new Date(date);
    return d.toISOString().split('T')[0];
};

const formatDisplayDate = (date) => {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
};

const getWeekDates = (startDate) => {
    const dates = [];
    const start = new Date(startDate);
    for (let i = 0; i < 7; i++) {
        const date = new Date(start);
        date.setDate(start.getDate() + i);
        dates.push({
            date: formatDate(date),
            day: date.getDate(),
            day_name: date.toLocaleDateString('en-US', { weekday: 'long' }),
            short_day: date.toLocaleDateString('en-US', { weekday: 'short' })
        });
    }
    return dates;
};

export function PublicCalendar() {
    const { sports, fetchSports } = useSportsStore();
    const { departments, fetchDepartments } = useDepartmentStore();
    // const { matchesByDate, tournamentsByDate, fetchMatchesByDateRange, loading } = useMatchStore();
    const { matchesByDate, tournamentsByDate, fetchMatchesByDateRange, loading, } = usePublicStore();

    const [currentWeekStart, setCurrentWeekStart] = useState(() => {
        const today = new Date();
        const day = today.getDay();
        const diff = today.getDate() - day;
        const weekStart = new Date(today.setDate(diff));
        return formatDate(weekStart);
    });

    const [currSport, setCurrSport] = useState("All sports");
    const [currDepartment, setCurrDepartment] = useState("All");

    const weekDates = getWeekDates(currentWeekStart);
    const weekEndDate = formatDate(new Date(new Date(currentWeekStart).setDate(new Date(currentWeekStart).getDate() + 6)));

    const fetchData = useCallback(async () => {
        await Promise.all([
            fetchSports(),
            fetchDepartments(),
            fetchMatchesByDateRange(currentWeekStart, weekEndDate)
        ]);
    }, [currentWeekStart, weekEndDate, fetchSports, fetchDepartments, fetchMatchesByDateRange]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handlePrevWeek = () => {
        const newStart = new Date(currentWeekStart);
        newStart.setDate(newStart.getDate() - 7);
        setCurrentWeekStart(formatDate(newStart));
    };

    const handleNextWeek = () => {
        const newStart = new Date(currentWeekStart);
        newStart.setDate(newStart.getDate() + 7);
        setCurrentWeekStart(formatDate(newStart));
    };

    const formatWeekTitle = () => {
        const start = new Date(currentWeekStart);
        const end = new Date(start);
        end.setDate(end.getDate() + 6);
        const startMonth = start.toLocaleDateString('en-US', { month: 'long' });
        const endMonth = end.toLocaleDateString('en-US', { month: 'long' });
        
        if (startMonth === endMonth) {
            return `${startMonth} ${start.getDate()} - ${end.getDate()}`;
        }
        return `${startMonth} ${start.getDate()} - ${endMonth} ${end.getDate()}`;
    };

    const filteredMatches = matchesByDate.filter(m => {
        if (currSport !== "All sports" && m.sports_category !== currSport) return false;
        return true;
    });

    const filteredTournaments = tournamentsByDate.filter(t => {
        if (currSport !== "All sports" && t.sport_name !== currSport) return false;
        return true;
    });

    const allEvents = [
        ...filteredMatches.map(m => ({ ...m, type: 'match' })),
        ...filteredTournaments.map(t => ({ ...t, type: 'tournament' }))
    ].sort((a, b) => new Date(a.date || a.start_date) - new Date(b.date || b.start_date));

    const getEventsForDate = (dateStr) => {
        return allEvents.filter(event => {
            const eventDate = event.date || event.start_date;
            return formatDate(new Date(eventDate)) === dateStr;
        });
    };

    const days = weekDates.map(d => ({
        ...d,
        events: getEventsForDate(d.date)
    }));

    // console.log(allEvents)
    return (
        <div className="mx-auto my-24 max-w-6xl pt-8 pb-16 px-3 flex flex-col">
            <h1 className="mb-6 border-l-8 border-custom-primary pl-3 font-freshman tracking-wider text-custom-secondary text-2xl">EVENT CALENDAR</h1>
            <div className="flex items-center space-x-3">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="w-44 justify-between">{currSport} <ChevronDown /> </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="start">
                        <DropdownMenuRadioGroup value={currSport} onValueChange={setCurrSport}>
                            <DropdownMenuRadioItem value="All sports" >All sports</DropdownMenuRadioItem>
                            {sports.map(sport => (
                                <DropdownMenuRadioItem key={sport.sport_id} value={sport.name} >{sport.name}</DropdownMenuRadioItem>
                            ))}
                        </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="justify-between">{currDepartment} <ChevronDown /> </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="start">
                        <DropdownMenuRadioGroup value={currDepartment} onValueChange={setCurrDepartment}>
                            <DropdownMenuRadioItem value="All" >All</DropdownMenuRadioItem>
                            {departments.map(dept => (
                                <DropdownMenuRadioItem key={dept.id} value={dept.name} >{dept.name}</DropdownMenuRadioItem>
                            ))}
                        </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <section className="flex flex-col items-center my-10 space-y-5">
                <div className="flex items-center space-x-12">
                    <Button variant="outline" size="icon" onClick={handlePrevWeek} disabled={loading}>
                        <ChevronsLeft />
                    </Button>
                    <p className="font-freshman text-custom-secondary tracking-wider text-xl">{formatWeekTitle()}</p>
                    <Button variant="outline" size="icon" onClick={handleNextWeek} disabled={loading}>
                        <ChevronsRight />
                    </Button>
                </div>
                
                {loading ? (
                    <div className="flex items-center justify-center w-full min-h-44">
                        <Loader2 className="h-8 w-8 animate-spin text-custom-primary" />
                    </div>
                ) : (
                    <div className="grid grid-cols-4 lg:grid-cols-7 w-full min-h-44">
                        {days.map((day, idx) => (
                            <div key={idx} className="flex flex-col items-center justify-center border border-zinc-200 space-y-3 p-3">
                                <p className="font-freshman text-xl">{day.day}</p>
                                <p className="font-semibold">{day.short_day}</p>
                                {day.events.length === 0 ?
                                    <p className="text-sm">No events</p> : day.events.length > 1 ?
                                        <p className="flex items-center text-sm font-medium text-custom-secondary">{day.events.length} events </p> :
                                        <p className="flex items-center text-sm font-medium text-custom-secondary">{day.events.length} event </p>
                                }
                            </div>
                        ))}
                    </div>
                )}
            </section>

<main className="w-full flex flex-col space-y-6">
                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-custom-primary" />
                    </div>
                ) : allEvents.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                        <p>No events found for this week.</p>
                    </div>
                ) : (
                    Object.entries(
                        allEvents.reduce((acc, event) => {
                            const dateKey = event.date || event.start_date;
                            if (!acc[dateKey]) {
                                acc[dateKey] = [];
                            }
                            acc[dateKey].push(event);
                            return acc;
                        }, {})
                    ).sort(([dateA], [dateB]) => new Date(dateA) - new Date(dateB)).map(([date, dateEvents]) => (
                        <section key={date} className="flex flex-col space-y-3">
                            <p className="w-fit font-freshman tracking-wider pb-2 border-b-4 border-primary text-custom-secondary">
                                {formatDisplayDate(date).toUpperCase()}
                            </p>

                            {/* {dateEvents.map(event => (
                                event.type === 'tournament' ? (
                                    <div key={event.tournament_id} className="relative flex flex-col md:flex-row items-center justify-between border border-zinc-200 rounded-md md:rounded-2xl p-6 gap-3 md:gap-0">
                                        <p className="absolute top-0 left-0 rounded-tl-md rounded-br-md text-sm bg-custom-primary py-1 px-4 font-medium text-custom-secondary w-fit  ">Tournament</p>
                                    
                                         <div className="flex flex-col items-center justify-center space-y-4 w-full md:w-[50%]">
                                            <p className="font-freshman">{(event.sport_name || 'Unknown').toLocaleUpperCase()}</p>
                                            <div className="flex items-center justify-around w-full pb-3">
                                                <div className="flex flex-col items-center justify-center flex-1 gap-1">
                                                    <Avatar className="size-14">
                                                        <AvatarImage src={event.team_a_logo || wmsuLogo} />
                                                    </Avatar>
                                                    <p className='font-medium'>{event.team_a || 'TBD'}</p>
                                                </div>
                                                <div className="flex flex-col items-center justify-center">
                                                    <p>VS</p>
                                                </div>
                                                <div className="flex flex-col items-center justify-center flex-1 gap-1">
                                                    <Avatar className="size-14">
                                                        <AvatarImage src={event.team_a_logo || wmsuLogo} />
                                                    </Avatar>
                                                    <p className='font-medium'>{event.team_b || 'TBD'}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className=" flex flex-col items-center md:items-start justify-center space-y-2 w-full md:w-[30%]">
                                            <div className="flex items-top gap-2">
                                                <p className="text-xs bg-amber-300 py-0.5 px-2 font-medium text-custom-secondary w-fit  ">{event.is_finished ? 'Finished' : 'Upcoming'}</p>
                                                <p className="font-semibold text-custom-secondary text-sm">{event.match_name || 'Unknown'}</p>
                                            </div>

                                            <p className="flex text-sm items-center">
                                                {formatDateToString(event.date)} <Dot /> 
                                                {event.start_time && event.end_time ? `${event.start_time} - ${event.end_time}` : 'Time TBD'} 
                                            </p>
                                            <p className="text-sm flex items-center text-muted-foreground ">
                                                <MapPin className="size-4 mr-1" />
                                                {event.location || 'Location TBD'}</p>
                                        </div>
                                        
                                        <Button className="bg-custom-primary text-custom-secondary md:w-fit">View</Button>
                                    </div>
                                ) : (
                                    <div key={event.match_id} className="flex flex-col md:flex-row items-center justify-between border border-zinc-200 rounded-md md:rounded-2xl p-6 gap-3 md:gap-0">
                                        <div className="flex flex-col items-center justify-center space-y-4 w-full md:w-[50%]">
                                            <p className="font-freshman">{(event.sports_category || 'Unknown').toLocaleUpperCase()}</p>
                                            <div className="flex items-center justify-around w-full pb-3">
                                                <div className="flex flex-col items-center justify-center flex-1">
                                                    {event.team_a_logo ? <img src={event.team_a_logo} alt="" className="size-14" /> : ''}
                                                    <p className='font-medium'>{event.team_a || 'TBD'}</p>
                                                </div>
                                                <div className="flex flex-col items-center justify-center">
                                                    <p>VS</p>
                                                </div>
                                                <div className="flex flex-col items-center justify-center flex-1">
                                                    {event.team_b_logo ? <img src={event.team_b_logo} alt="" className="size-14" /> : ''}
                                                    <p className='font-medium'>{event.team_b || 'TBD'}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className=" flex flex-col items-center md:items-start justify-center space-y-2 w-full md:w-[30%]">
                                            <div className="flex items-center gap-2">
                                                <p className="text-xs bg-amber-300 py-0.5 px-2 font-medium text-custom-secondary w-fit  ">{event.is_finished ? 'Finished' : 'Upcoming'}</p>
                                                <p className="font-semibold text-custom-secondary text-lg">{event.match_name || 'Match'}</p>
                                            </div>

                                            <p className="flex text-sm items-center">{event.start_time} - {event.end_time} </p>
                                            <p className="text-sm flex items-center "><Dot /> {event.location || 'TBD'}</p>
                                        </div>

                                        <Button className="bg-custom-primary text-custom-secondary w-[200px] md:w-fit">View</Button>
                                    </div>
                                )
                            ))} */}
                             {dateEvents.map(event => (
                                    <div key={event.match_id || event.tournament_id} className="relative flex flex-col md:flex-row items-center justify-between border border-zinc-200 rounded-md md:rounded-2xl p-6 gap-3 md:gap-0">
                                        <p className="absolute top-0 left-0 rounded-tl-md rounded-br-md text-sm bg-custom-primary py-1 px-4 font-medium text-custom-secondary w-fit  ">{event.type.toLocaleUpperCase() }</p>
                                    
                                         <div className="flex flex-col items-center justify-center space-y-4 w-full md:w-[50%]">
                                            <p className="font-freshman">{(event.sport_name || 'Unknown').toLocaleUpperCase()}</p>
                                            <div className="flex items-center justify-around w-full pb-3">
                                                <div className="flex flex-col items-center justify-center flex-1 gap-1">
                                                    <Avatar className="size-14">
                                                        <AvatarImage src={event.team_a_logo || wmsuLogo} />
                                                    </Avatar>
                                                    <p className='font-medium'>{event.team_a || 'TBD'}</p>
                                                </div>
                                                <div className="flex flex-col items-center justify-center">
                                                    <p>VS</p>
                                                </div>
                                                <div className="flex flex-col items-center justify-center flex-1 gap-1">
                                                    <Avatar className="size-14">
                                                        <AvatarImage src={event.team_a_logo || wmsuLogo} />
                                                    </Avatar>
                                                    <p className='font-medium'>{event.team_b || 'TBD'}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className=" flex flex-col items-center md:items-start justify-center space-y-2 w-full md:w-[30%]">
                                            <div className="flex items-top gap-2">
                                                <p className={`text-xs py-0.5 px-2 font-medium w-fit  ${event.is_finished ? 'bg-amber-300 text-custom-secondary ' : 'bg-green-300  text-green-800'}`}>
                                                    {event.is_finished ? 'Finished' : 'Upcoming'}
                                                </p>
                                                <p className="font-semibold text-custom-secondary text-sm">{event.match_name || 'Unknown'}</p>
                                            </div>

                                            <p className="flex text-sm items-center">
                                                {formatDateToString(event.date)} <Dot /> 
                                                {event.start_time && event.end_time ? `${event.start_time} - ${event.end_time}` : 'Time TBD'} 
                                            </p>
                                            <p className="text-sm flex items-center text-muted-foreground ">
                                                <MapPin className="size-4 mr-1" />
                                                {event.location || 'Location TBD'}</p>
                                        </div>
                                        
                                        <Button className="bg-custom-primary text-custom-secondary md:w-fit">View</Button>
                                    </div>
                            ))}
                        </section>
                    ))
                )}
            </main>
        </div>
    )
}