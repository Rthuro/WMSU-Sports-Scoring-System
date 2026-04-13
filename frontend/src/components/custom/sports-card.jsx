import { Card, CardHeader, CardTitle, CardFooter } from "../ui/card"
import { ArrowUpRight, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { adminRoute } from "@/lib/helpers";

export function SportsCard({ sports }) {
    // const findSportTeam = (sportId) => {
    //    return sports.varsityTeam[sportId.toLowerCase()];
    // }

    return (
        <div className=" dark:*:data-[slot=card]:bg-card grid grid-cols-2 gap-3  @xl/main:grid-cols-2 @5xl/main:grid-cols-3 ">
            {/* {sports.sportsCardData.map( sport => (
                <Link key={sport.id} to={`/Sports/${sport.name}`}>
                    <Card className="@container/card bg-white shadow-md border border-red-100 shadow-red-50 hover:shadow-lg cursor-pointer">
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between text-md font-semibold tabular-nums @[250px]/card:text-2xl">
                                <div className="flex items-center gap-3 text-red ">
                                    <img src={sport.icon} alt="" className="h-5 " />
                                    {sport.name}
                                </div>
                                <div className="bg-red-50 text-red border border-red-200 rounded-lg p-2"> 
                                    <ArrowUpRight className="size-4 " /> 
                                </div>
                                
                            </CardTitle>
                        </CardHeader>
                        <CardFooter className="flex-col items-start gap-1.5 text-sm">
                                <p className="font-medium">Varsity Players</p> 
                            <div className="flex gap-2">
                                    <p >
                                    Men: <span className="text-muted-foreground">{findSportTeam(sport.id).men.length}</span>
                                    </p>
                                    <p >
                                    Women: <span className="text-muted-foreground">{findSportTeam(sport.id).women.length}</span>
                                    </p>
                                </div>
                        </CardFooter>
                    </Card>
                </Link>
                
            ))} */}

            {sports.map(sport => (
                <Link key={sport.sport_id}
                    to={adminRoute(`Sports/${sport.name}`)}>
                    <Card className="@container/card bg-white shadow-md border border-red-100 shadow-red-50 hover:shadow-lg cursor-pointer">
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between text-md font-semibold tabular-nums @[250px]/card:text-2xl">
                                <div className="flex items-center gap-3 text-red ">
                                    {/* <img src={sport.icon} alt="" className="h-5 " /> */}
                                    {sport.name}
                                </div>
                                <div className="bg-red-50 text-red border border-red-200 rounded-lg p-2">
                                    <ArrowUpRight className="size-4 " />
                                </div>

                            </CardTitle>
                        </CardHeader>
                    </Card>
                </Link>

            ))}


        </div>
    )
}