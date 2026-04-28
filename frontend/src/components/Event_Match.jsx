import React from "react"
import { Dot, Ellipsis } from 'lucide-react'
import wmsuLogo from '@/assets/logo/Western_Mindanao_State_University.png'
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { formatDateToString } from "@/lib/helpers"

const Event_Match = ({ event_name, event_date, match_start_time, match_end_time, sports_category, team_a, team_b, team_a_logo, team_b_logo, team_a_score, team_b_score }) => {
    return (
        <div className="flex flex-col items-center hover:bg-custom-secondary/5">
            <div className="border-b border-zinc-200 w-full p-2">
                <div className='flex items-center justify-between'>
                    <p id="event_name" className="font-semibold text-custom-secondary text-lg">{event_name}</p>
                    <Ellipsis />
                </div>
                <p className="flex items-center">{formatDateToString(event_date) || 'TBD'} <Dot /> {match_start_time && match_end_time ? `${match_start_time} - ${match_end_time}` : 'Time TBD'}</p>
            </div>

            <div className="flex items-center justify-center w-full my-3">
                <p className="text-lg font-medium text-custom-secondary">{sports_category}</p>
            </div>

            <div className="flex items-center justify-around w-full pb-3 border-b border-zinc-200">
                <div className="flex flex-col items-center justify-center flex-1">
                    <Avatar className="size-14">
                        <AvatarImage src={team_a_logo ? team_a_logo : wmsuLogo} alt="" />
                    </Avatar>
                    <p className='font-medium'>{team_a}</p>
                    <p>{team_a_score || 0}</p>
                </div>
                <div className="flex flex-col items-center justify-center">
                    <p>VS</p>
                </div>
                <div className="flex flex-col items-center justify-center flex-1">
                    <Avatar className="size-14">
                        <AvatarImage src={team_b_logo ? team_b_logo : wmsuLogo} alt=""  />
                    </Avatar>
                    <p className='font-medium'>{team_b}</p>
                    <p>{team_b_score || 0}</p>
                </div>
            </div>
        </div>
    )
}

export default Event_Match