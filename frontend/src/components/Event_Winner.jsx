import React from "react"
import { Dot, Ellipsis, Crown } from 'lucide-react'

const Event_Winner = ({ event_name, event_date, match_start_time, match_end_time, sports_category, team_a, team_b, team_a_logo, team_b_logo, winner }) => {
    const lose_team_display_style = 'flex items-center justify-between flex-1'
    const winner_team_display_style = 'flex items-center justify-between flex-1 bg-custom-secondary text-custom-primary border-l-4 border-custom-primary p-2 font-medium';

    const isTeamAWinner = winner.toLowerCase() === team_a.toLowerCase();
    const isTeamBWinner = winner.toLowerCase() === team_b.toLowerCase();

    return (
        <div className="flex flex-col items-center p-3">
            <div className="border-b border-zinc-200 w-full p-2">
                <div className='flex items-center justify-between'>
                    <p id="event_name" className="font-semibold text-custom-secondary text-lg">{event_name}</p>
                    <Ellipsis />
                </div>
                <p className="flex items-center">{event_date} <Dot /> {match_start_time} - {match_end_time}</p>
            </div>

            <div className="flex items-center justify-center w-full my-3">
                <p className="text-lg font-medium text-custom-secondary">{sports_category}</p>
            </div>

            <div className="flex flex-col justify-around w-full pb-3 gap-3 ">
                <div className={isTeamAWinner ? winner_team_display_style : lose_team_display_style}>
                    <div className="flex gap-2 items-center">
                        {team_a_logo && <img src={team_a_logo} alt="" className="size-14" />}
                        <p className='font-medium'>{team_a}</p>
                    </div>
                    <p>8</p>
                </div>

                <div className={isTeamBWinner ? winner_team_display_style : lose_team_display_style}>
                    <div className="flex gap-2 items-center">
                        {team_b_logo && <img src={team_b_logo} alt="" className="size-14" />}
                        <p className='font-medium'>{team_b}</p>
                    </div>
                    <p>10</p>
                </div>
            </div>
        </div>
    )
}

export default Event_Winner