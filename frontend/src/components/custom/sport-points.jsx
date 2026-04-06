import { Button } from "@/components/ui/button"
import { Plus, Minus } from "lucide-react"
import { Separator } from "@/components/ui/separator";

export function SportPoints({scoringPoints, penalties, teamScore, matchPointsData, setMatchPointsData, minusPenalty, changeMinusPenalty, regularPenalty, changeRegularPenalty, resetScoringState, maxScore, team}) {
    return (
        <div className="grid gap-4">
            { scoringPoints?.length === 1 ? (

                <div className="grid grid-cols-2 justify-center gap-4 col-span-2">
                        <Button className="py-6" onClick={ () => {
                            if(teamScore + scoringPoints[0].point <= maxScore) {
                                setMatchPointsData( prev => ({
                                    ...prev,
                                    [team]: teamScore + scoringPoints[0].point
                                }));
                            }else {
                                resetScoringState(matchPointsData)
                            }
                             
                            
                            }}  >
                            <Plus className="size-6" />
                        </Button>
                        <Button className="py-6" onClick={ () => 
                            teamScore == 0 ? teamScore : setMatchPointsData({
                                ...matchPointsData,
                                [team]: teamScore - scoringPoints[0].point
                            })} >
                                    <Minus className="size-6" />
                        </Button>  
                </div>
                    ) : (
                        <div className="grid grid-cols-2 justify-center gap-4 col-span-2">
                            <div className="grid-cols-2 grid gap-4  col-span-2">
                                { scoringPoints?.map( point => (
                                        <Button variant="outline" key={point.scoring_point_id} className="w-full text-lg font-bold  py-6"
                                        onClick={ () => 
                                        { 
                                        if(teamScore + point.point <= maxScore) {
                                            setMatchPointsData( prev => ({
                                                ...prev,
                                                [team]: teamScore + point.point
                                            }));
                                        }else {
                                            resetScoringState(matchPointsData)
                                        }
                                        }}>
                                            + {point.point}</Button>
                                        ))}
                                
                            </div>
                            <Button  className=" py-6 col-span-2" onClick={ () => 
                                teamScore == 0 ? teamScore : setMatchPointsData( prev => ({
                                    ...prev,
                                    [team]: teamScore - 1
                                }))
                            } >
                                <Minus className="size-6" />
                            </Button>

                        </div>
                        )
            }
            { penalties && <Separator className="col-span-2" />}
            { penalties?.map( penalty => 
                <div key={penalty?.penalty_id} className="col-span-2 grid grid-cols-2 w-full gap-4">
                        <Button variant="outline" className="py-6" 
                        onClick={ () => {
                            if(penalty?.affects_score ){
                                if (teamScore > 0) {
                                    setMatchPointsData( prev => ({
                                        ...prev,
                                        [team]: teamScore - penalty?.penalty_point
                                    }))
                                    changeMinusPenalty(minusPenalty + penalty?.penalty_point);
                                }
                            }else {
                                changeRegularPenalty( regularPenalty + penalty?.penalty_point)
                            }
                            
                            }} >
                                {penalty?.penalty_name} (-1)
                        </Button>
                        <Button variant="outline" className="py-6" 
                        onClick={ () => { 
                            if(penalty?.affects_score ){
                            if (minusPenalty == 0) {
                                    minusPenalty
                                }else{  
                                    changeMinusPenalty( minusPenalty - penalty?.penalty_point);
                                    setMatchPointsData( prev => ({
                                        ...prev,
                                        [team]: teamScore + penalty?.penalty_point
                                    }))
                                }
                            }else {
                                regularPenalty == 0 ? regularPenalty : changeRegularPenalty( regularPenalty - penalty?.penalty_point)
                            }
                            
                            }} >
                            <Minus className="size-5" />
                        </Button>
                    </div>
                )}
        </div>
    )}