import React from 'react';
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Dialog
} from "@/components/ui/dialog"
import { Link } from "react-router-dom"
import { ArrowRight } from "lucide-react";
// import { useState } from 'react';
// import { sportsData } from '@/data/sports-data';

export function ScoringDialogue({sport}) {

  // const [selectedSport, changeSport] =  useState(sport || "");

  // const sportDetails = sportsData.sportsCardData.find((s) => s.id === selectedSport?.toLowerCase());
  
 



  return (
     <Dialog>
        <DialogTrigger asChild>
           <button  data-slot="card" className="flex items-center justify-between text-red rounded-lg py-3 px-5 border bg-white border-red-100 shadow-red-50 shadow-lg hover:bg-white/60 hover:shadow-red-100 cursor-pointer max-w-2xs">
                      <div className="flex gap-3 items-center">
                          {/* <img src={sportDetails.icon} alt="" className="h-6 " /> */}
                          <p className=" font-semibold tabular-nums ">
                              {sport?.name}
                          </p>
                      </div>
                      <ArrowRight className="size-5 " />
            </button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Scoring Type</DialogTitle>
            <DialogDescription className='w-[350px] text-sm'>
                Pick between quick scoring with no data saved, or detailed scoring with team/player tracking.  
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 ">
            <Link to={`/Sports/${sport?.name}/scoring`} className="text-left border rounded-lg p-3  w-[350px] bg-zinc-900 text-white flex flex-col gap-2 hover:bg-zinc-800 shadow-md">
                      <p className="font-medium">Quick Scoring</p>
                      <p className="text-sm text-white/80 text-wrap ">
                        Use default teams (Team A vs Team B) with no player tracking. Results are not saved.
                      </p>
              </Link>
            <Link to={`/Sports/${sport?.name}/match`} className="text-left w-[350px] border rounded-lg p-3 flex flex-col gap-2 hover:bg-zinc-100">
                    <p className="font-medium">Team-Based Scoring</p>
                    <p className="text-sm text-muted-foreground">
                      Select actual teams and players. Scores and stats will be saved to the system.
                    </p>
                </Link>
          </div>
        </DialogContent>
    </Dialog>
   
    
  )
}
