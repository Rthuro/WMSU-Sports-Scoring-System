import React from "react"
import { Dot, Ellipsis, Crown } from 'lucide-react'
import wmsuLogo from '@/assets/logo/Western_Mindanao_State_University.png'
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { formatDateToString } from "@/lib/helpers"

const Event_Winner = ({ event_name, event_date, match_start_time, match_end_time, sports_category, team_a, team_b, team_a_logo, team_b_logo, winner, team_a_id, team_b_id, total_a_score, total_b_score }) => {
    const lose_team_display_style = 'flex items-center justify-between flex-1'
    const winner_team_display_style = 'flex items-center p-1 justify-between flex-1 bg-custom-secondary text-custom-primary border-l-4 border-custom-primary py-3 px-2 font-medium';

    const isTeamAWinner = winner === team_a_id;
    const isTeamBWinner = winner === team_b_id;

    return (
        <div className="flex flex-col items-center p-3">
            <div className="border-b border-zinc-200 w-full p-2">
                <div className='flex items-center justify-between'>
                    <p id="event_name" className="font-semibold text-custom-secondary text-lg">{event_name}</p>
                    <Ellipsis />
                </div>
                <p className="flex items-center">{formatDateToString(event_date) || 'TBA'} <Dot /> {match_start_time && match_end_time ? `${match_start_time} - ${match_end_time}` : 'Time TBD'} </p>
            </div>

            <div className="flex items-center justify-center w-full my-3">
                <p className="text-lg font-medium text-custom-secondary">{sports_category}</p>
            </div>

            <div className="flex flex-col justify-around w-full pb-3 gap-3 ">
                <div className={isTeamAWinner ? winner_team_display_style : lose_team_display_style}>
                    <div className="flex gap-2 items-center">
                        <Avatar className="size-10">
                            <AvatarImage src={team_a_logo ? team_a_logo : wmsuLogo} alt="" />
                        </Avatar>
                        <p className='font-medium'>{team_a}</p>
                    </div>
                    <p>{total_a_score}</p>
                </div>

                <div className={isTeamBWinner ? winner_team_display_style : lose_team_display_style}>
                    <div className="flex gap-2 items-center">
                        <Avatar className="size-10">
                            <AvatarImage src={team_b_logo ? team_b_logo : wmsuLogo} alt="" />
                        </Avatar>
                        <p className='font-medium'>{team_b}</p>
                    </div>
                    <p>{total_b_score}</p>
                </div>
            </div>
        </div>
    )
}

export default Event_Winner