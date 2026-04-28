import React, {useEffect} from "react"
import hero_img from "@/assets/home/hero_img.png"
import departments from "@/data/department_loop.js"
import { ArrowRight, ArrowUpRight, FileText } from 'lucide-react'
import sample_event_img from "@/assets/home/sample_img_bg.jpg"
import { events, events_match, event_winners } from '@/data/events.js'
import Event_Match from "@/components/Event_Match"
import Event_Winner from "@/components/Event_Winner"
import { Link } from 'react-router-dom'
import { usePublicStore } from "@/store/usePublicStore";

export function PublicHome() {
      const { allMatches, allTournaments, fetchAllMatches, } = usePublicStore();
       useEffect(() => {
            fetchAllMatches();
        }, [fetchAllMatches]);

      const limit = 4;
      const recentMatches = allMatches.slice(0, limit);
      const recentTournaments = allTournaments.slice(0, limit);
  
  return (
    <div className="pb-16">

      <div id="hero" className="bg-fill h-[calc(100vh+68px)] w-full relative bg-center"
        style={{ backgroundImage: `url(${hero_img})` }} >
        <div className="bg-custom-secondary/80 absolute right-0 left-0 top-0 bottom-0 w-full h-full -z-0"></div>
        <div className="flex flex-col items-center justify-center h-full gap-16 z-20">
          <div className="flex flex-col gap-3 items-center">
            <p className="text-center text-8xl drop-shadow-md text-custom-primary font-freshman ">WMSU SPORTS</p>
            <p className="text-lg md:text-xl drop-shadow-md text-white">The Official WMSU Sports Event Website</p>
          </div>
          <Link to="/Events" className="bg-custom-primary font-medium text-custom-secondary flex items-center justify-between gap-4 pl-6 pr-4 py-3 shadow-[0_2px_32px_0_rgba(254,174,1,0.60)] text-lg z-10 rounded">
            See Events
            <ArrowRight />
          </Link>
        </div>
      </div>

      {/* lists of wmsu department */}
      <div className="overflow-hidden mx-3 md:mx-16 my-24">
        <div className="flex gap-6 animate-loopScroll w-fit pr-24">
          {[...departments, ...departments].map((department, idx) => (
            <div key={idx} className="flex items-center min-w-fit gap-1">
              <img src={department.logo} alt="" className="size-12 md:size-14" />
              <p className="text-xs text-center w-fit max-w-[180px] break-normal">
                {department.department}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Example Events */}
      <section className="mx-auto max-w-6xl my-16 flex flex-col gap-6 px-3">
        <div className="flex items-center justify-between bg-custom-primary px-6 py-5 rounded-t-2xl">
          <p className="font-freshman text-2xl tracking-wider flex items-center text-custom-secondary ">
            EVENTS </p>
          <button className="px-4 py-2 font-medium bg-custom-secondary text-custom-primary rounded">View all events</button>
        </div>
        <section className="grid grid-cols-1 md:grid-cols-2 w-full gap-x-6 gap-y-3 ">
          {
              recentMatches.map((match, idx) =>
                  <Event_Match key={idx}
                    event_name={match.match_name}
                    event_date={match.date}
                    match_start_time={match.start_time}
                    match_end_time={match.end_time}
                    sports_category={match.sport_name}
                    team_a={match.team_a}
                    team_b={match.team_b}
                    team_a_logo={match.team_a_logo}
                    team_b_logo={match.team_b_logo} 
                    team_a_score={match.total_a_score}
                    team_b_score={match.total_b_score}
                    />
              )
          }{
             recentTournaments.map((match, idx) =>
                  <Event_Match key={idx}
                    event_name={match.match_name}
                    event_date={match.date}
                    match_start_time={match.start_time}
                    match_end_time={match.end_time}
                    sports_category={match.sport_name}
                    team_a={match.team_a}
                    team_b={match.team_b}
                    team_a_logo={match.team_a_logo}
                    team_b_logo={match.team_b_logo}
                    team_a_score={match.total_a_score}
                    team_b_score={match.total_b_score} />
                  
              )
          }
          {
            recentMatches.length === 0 && recentTournaments.length === 0 && (
               <div className="text-center py-12 text-muted-foreground">
                    <p className="text-white">No events created</p>
                </div>
            )
          }
        </section>
      </section>

      {/* Example Event Winners*/}
      <section className="mx-auto max-w-6xl my-20 flex flex-col px-3">
        <div className="flex items-center justify-between py-5 border-b-4 border-custom-primary">
          <p className="font-freshman text-2xl tracking-wider  flex items-center text-custom-secondary gap-2">
            EVENT WINNERS
          </p>
          <button className="px-4 py-2 font-medium bg-custom-secondary text-custom-primary rounded">View all winners</button>
        </div>

        <section className="grid grid-cols-1 md:grid-cols-2 w-full space-x-6 space-y-3 bg-custom-primary/5">
          {
              recentMatches.map((winner, idx) =>
                  <Event_Winner key={idx}
                    event_name={winner.match_name}
                    event_date={winner.date}
                    match_start_time={winner.start_time}
                    match_end_time={winner.end_time}
                    sports_category={winner.sport_name}
                    team_a={winner.team_a}
                    team_b={winner.team_b}
                    team_a_logo={winner.team_a_logo}
                    team_b_logo={winner.team_b_logo}
                    winner={winner.winner_id}
                    team_a_id={winner.team_a_id}
                    team_b_id={winner.team_b_id}
                    total_a_score={winner.total_a_score}
                    total_b_score={winner.total_b_score}
                  />
              )
          }
           {
              recentTournaments.map((winner, idx) =>
                  <Event_Winner key={idx}
                    event_name={winner.match_name}
                    event_date={winner.date}
                    match_start_time={winner.start_time}
                    match_end_time={winner.end_time}
                    sports_category={winner.sport_name}
                    team_a={winner.team_a}
                    team_b={winner.team_b}
                    team_a_logo={winner.team_a_logo}
                    team_b_logo={winner.team_b_logo}
                    winner={winner.winner_id}
                    team_a_id={winner.team_a_id}
                    team_b_id={winner.team_b_id}
                    total_a_score={winner.total_a_score}
                    total_b_score={winner.total_b_score}
                  />
              )
          }
          {
            recentMatches.length === 0 && recentTournaments.length === 0 && (
               <div className="text-center py-12 text-muted-foreground">
                    <p className="text-white">Nothing to show</p>
                </div>
            )
          }
        </section>
      </section>

      <section className="flex flex-col mx-auto max-w-6xl gap-6 my-16 px-3">
        <div className="flex items-center justify-between bg-custom-secondary px-6 py-5 rounded-t-2xl">
          <p className="font-freshman tracking-widest text-2xl flex items-top text-custom-primary gap-2">
            <FileText className="mt-[2px]" />
            HEADLINES
          </p>
          <button className="px-4 py-2 font-medium bg-custom-primary text-custom-secondary rounded">View all archives</button>
        </div>

        {/* Example Headline */}
        <div className="flex flex-col space-y-6 px-3">
          <section className="flex flex-col-reverse md:flex-row justify-between w-full h-fit md:min-h-72 md:max-h-80 rounded-2xl border border-zinc-200 overflow-hidden ">
            <div className="p-5 flex flex-col justify-center gap-6 w-full md:w-[50%]">
              <div className="space-y-2">
                <p className="text-2xl lg:text-3xl tracking-wider font-freshman text-custom-secondary ">MASTS 2024 FRIENDSHIP GAMES</p>
                <p className="text-sm lg:text-md"> WMSU finished in fifth place, delivering an impressive performance in both sport and socio-cultural categories.</p>
                <p className="text-custom-secondary text-sm font-medium mt-3">December 6, 2024</p>
              </div>
              <a href="" className="flex items-center font-semibold gap-2 bg-custom-secondary text-custom-primary w-fit py-2 px-4 rounded">View link <ArrowUpRight /> </a>
            </div>
            <img src={hero_img} alt="" srcset="" className=" object-cover object-center w-full md:w-[50%]" />
          </section>
          <section className="flex flex-col-reverse md:flex-row justify-between w-full h-fit md:min-72 md:max-h-80 rounded-2xl border border-zinc-200 overflow-hidden ">
            <div className="p-5 flex flex-col justify-center gap-6 w-full md:w-[50%]">
              <div className="space-y-2">
                <p className="text-2xl lg:text-3xl tracking-wider font-freshman text-custom-secondary ">WMSU PALARO 2024: THE OPENING GAMBIT</p>
                <p className="text-sm lg:text-md">Today, November 4th, marks the start of the sports events under the theme "Stronger Together, Victorious Forever.</p>
                <p className="text-custom-secondary text-sm font-medium mt-3">November 4, 2024</p>
              </div>

              <a href="" className="flex items-center font-semibold gap-2 bg-custom-secondary text-custom-primary w-fit py-2 px-4 rounded">View link <ArrowUpRight /> </a>
            </div>
            <img src={sample_event_img} alt="" srcset="" className=" object-cover object-center  w-full md:w-[50%]" />
          </section>
        </div>
      </section>
    </div>
  )
}
