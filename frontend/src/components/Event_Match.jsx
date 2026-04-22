import React from "react"
import { Dot, Ellipsis } from 'lucide-react'

const Event_Match = ({ event_name, event_date, match_start_time, match_end_time, sports_category, team_a, team_b, team_a_logo, team_b_logo }) => {
    let score = "";
    const sport = sports_category.toLowerCase();
    if (sport.includes('arnis')) {
        score = '0'
    } else if (sport.includes('volleyball') || sport.includes('basketball')) {
        score = '0 - 0'
    }
    return (
        <div className="flex flex-col items-center hover:bg-custom-secondary/5">
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

            <div className="flex items-center justify-around w-full pb-3 border-b border-zinc-200">
                <div className="flex flex-col items-center justify-center flex-1">
                    {team_a_logo ? <img src={team_a_logo} alt="" className="size-14" /> : ''}
                    <p className='font-medium'>{team_a}</p>
                    <p>{score}</p>
                </div>
                <div className="flex flex-col items-center justify-center">
                    <p>VS</p>
                </div>
                <div className="flex flex-col items-center justify-center flex-1">
                    {team_b_logo ? <img src={team_b_logo} alt="" className="size-14" /> : ''}
                    <p className='font-medium'>{team_b}</p>
                    <p>{score}</p>
                </div>
            </div>
        </div>
    )
}

export default Event_Match