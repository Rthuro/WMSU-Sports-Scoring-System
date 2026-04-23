import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { sports_list } from "@/data/sports"
import { useState } from "react"
import { ChevronDown, ChevronsRight, ChevronsLeft, Dot } from 'lucide-react'
import department from "@/data/department_loop"
import { events_info, events } from "@/data/events"

export function PublicEvents() {
    const [currSport, setSport] = useState("All sports")
    const [currDepartment, setDepartment] = useState("All")
    const days = [
        {
            day: 1,
            day_name: "Sunday",
            event: 0
        }, {
            day: 2,
            day_name: "Monday",
            event: 0
        }, {
            day: 3,
            day_name: "Tuesday",
            event: 0
        }, {
            day: 4,
            day_name: "Wednesday",
            event: 4
        },
        {
            day: 5,
            day_name: "Thursday",
            event: 2
        }, {
            day: 6,
            day_name: "Friday",
            event: 0
        }, {
            day: 7,
            day_name: "Saturday",
            event: 0
        }
    ]

    const day_4 = events_info.filter(event => event.date.includes('November 4'))
    const day_5 = events_info.filter(event => event.date.includes('November 5'))

    return (
        <div className="mx-auto my-24 max-w-6xl pt-8 pb-16 px-3 flex flex-col">
            <h1 className="mb-6 border-l-8 border-custom-primary pl-3 font-freshman tracking-wider text-custom-secondary text-2xl">EVENT CALENDAR</h1>
            <div className="flex items-center space-x-3">
                <DropdownMenu >
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="w-44 justify-between">{currSport} <ChevronDown /> </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="start">
                        <DropdownMenuRadioGroup value={currSport} onValueChange={setSport}>
                            <DropdownMenuRadioItem value="All sports" >All sports</DropdownMenuRadioItem>
                            {sports_list.map(sport => (
                                <DropdownMenuRadioItem value={sport} >{sport}</DropdownMenuRadioItem>
                            ))}
                        </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
                <DropdownMenu >
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="justify-between">{currDepartment} <ChevronDown /> </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="start">
                        <DropdownMenuRadioGroup value={currDepartment} onValueChange={setDepartment}>
                            <DropdownMenuRadioItem value="All" >All</DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="WMSU Varsity" >WMSU Varsity</DropdownMenuRadioItem>
                            {department.map(department => (
                                <DropdownMenuRadioItem value={department.department} >{department.department}</DropdownMenuRadioItem>
                            ))}
                        </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <section className="flex flex-col items-center my-10 space-y-5">
                <div className="flex items-center space-x-12">
                    <Button variant="outline" size="icon"><ChevronsLeft /></Button>
                    <p className="font-freshman text-custom-secondary tracking-wider text-xl">NOVEMBER 1 - 7</p>
                    <Button variant="outline" size="icon"><ChevronsRight /></Button>
                </div>
                <div className="grid grid-cols-4 lg:grid-cols-7 w-full min-h-44">
                    {days.map(day => (
                        <div className="flex flex-col items-center justify-center border border-zinc-200 space-y-3 p-3 ">
                            <p className="font-freshman text-xl">{day.day}</p>
                            <p className="font-semibold">{day.day_name}</p>
                            {day.event == 0 ?
                                <p className=" text-sm">No events</p> : day.event > 1 ?
                                    <p className="flex items-center text-sm font-medium text-custom-secondary">{day.event} events </p> :
                                    <p className="flex items-center text-sm font-medium text-custom-secondary">{day.event} event </p>
                            }
                        </div>
                    ))}

                </div>
            </section>

            <main className="w-full flex flex-col space-y-6">
                <section className="flex flex-col space-y-3">
                    <p className="w-fit font-freshman tracking-wider pb-2 border-b-4 border-primary text-custom-secondary">WEDNESDAY 4 NOVEMBER 2025</p>

                    {day_4.map(event => (
                        <div className="flex flex-col md:flex-row items-center justify-between border border-zinc-200 rounded-md md:rounded-2xl p-3 gap-3 md:gap-0">
                            <div className="flex flex-col items-center justify-center space-y-4 w-full md:w-[50%]">
                                <p className="font-freshman">{event.sports_category.toLocaleUpperCase()}</p>
                                <div className="flex items-center justify-around w-full pb-3">
                                    <div className="flex flex-col items-center justify-center flex-1">
                                        {event.team_a_logo ? <img src={event.team_a_logo} alt="" className="size-14" /> : ''}
                                        <p className='font-medium'>{event.team_a}</p>
                                    </div>
                                    <div className="flex flex-col items-center justify-center">
                                        <p>VS</p>
                                    </div>
                                    <div className="flex flex-col items-center justify-center flex-1">
                                        {event.team_b_logo ? <img src={event.team_b_logo} alt="" className="size-14" /> : ''}
                                        <p className='font-medium'>{event.team_b}</p>
                                    </div>
                                </div>
                            </div>

                            <div className=" flex flex-col items-center md:items-start justify-center space-y-2 w-full md:w-[30%]">
                                <div className="flex items-center gap-2">
                                    <p className="text-xs bg-amber-300 py-0.5 px-2 font-medium text-custom-secondary w-fit  ">{event.status}</p>
                                    <p className="font-semibold text-custom-secondary text-lg">{events.find(e => e.event_id == event.event_id).event_name}</p>
                                </div>

                                <p className="flex text-sm items-center">{event.start_time} - {event.end_time} </p>
                                <p className="text-sm flex items-center "><Dot /> {event.location}</p>
                            </div>

                            <Button className="bg-custom-primary text-custom-secondary w-[200px] md:w-fit">View</Button>
                        </div>
                    ))}
                </section>

                <section className="flex flex-col space-y-3">
                    <p className="w-fit font-freshman tracking-wider pb-2 border-b-4 border-primary text-custom-secondary">THURSDAY 5 NOVEMBER 2025</p>

                    {day_5.map(event => (
                        <div className="flex flex-col md:flex-row items-center justify-between border border-zinc-200 rounded-2xl p-3 gap-3 md:gap-0">
                            <div className="flex flex-col items-center justify-center space-y-4 w-full md:w-[50%]">
                                <p className="font-freshman">{event.sports_category.toLocaleUpperCase()}</p>
                                <div className="flex items-center justify-around w-full pb-3">
                                    <div className="flex flex-col items-center justify-center flex-1">
                                        {event.team_a_logo ? <img src={event.team_a_logo} alt="" className="size-14" /> : ''}
                                        <p className='font-medium'>{event.team_a}</p>
                                    </div>
                                    <div className="flex flex-col items-center justify-center">
                                        <p>VS</p>
                                    </div>
                                    <div className="flex flex-col items-center justify-center flex-1">
                                        {event.team_b_logo ? <img src={event.team_b_logo} alt="" className="size-14" /> : ''}
                                        <p className='font-medium'>{event.team_b}</p>
                                    </div>
                                </div>
                            </div>

                            <div className=" flex flex-col items-center md:items-start justify-center space-y-2 w-full md:w-[30%]">
                                <div className="flex items-center gap-2">
                                    <p className="text-xs bg-amber-300 py-0.5 px-2 font-medium text-custom-secondary w-fit  ">{event.status}</p>
                                    <p className="font-semibold text-custom-secondary text-lg">{events.find(e => e.event_id == event.event_id).event_name}</p>
                                </div>

                                <p className="flex text-sm items-center">{event.start_time} - {event.end_time} </p>
                                <p className="text-sm flex items-center "><Dot /> {event.location}</p>
                            </div>

                            <Button className="bg-custom-primary text-custom-secondary w-[200px] md:w-fit">View</Button>
                        </div>
                    ))}
                </section>
            </main>
        </div>
    )
}