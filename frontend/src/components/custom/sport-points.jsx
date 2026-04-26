import { Button } from "@/components/ui/button"
import { Plus, Minus } from "lucide-react"
import { Separator } from "@/components/ui/separator";

export function SportPoints({ scoringPoints, penalties, teamScore, matchPointsData, minusPenalty, changeMinusPenalty, regularPenalty, changeRegularPenalty, resetScoringState, sportData, handleTableScoreChange, team_type }) {

    const sport_max_score = sportData?.max_score
    // console.log("max score", sport_max_score)
    // console.log("sport data:", sportData)

    const addScore = (points) => {
        const newScore = teamScore + points;

        // If the max score is not set, or the new score is less than or equal to the max score, then add the score
        if (newScore <= sport_max_score || sport_max_score === null || sport_max_score === undefined) {
            console.log("new score", newScore)
            handleTableScoreChange(matchPointsData.set_number, team_type, newScore);
        } else {
            // console.log("clicked")
            resetScoringState(matchPointsData);
        }
    };

    const subtractScore = (points) => {
        if (teamScore <= 0) return;
        const newScore = Math.max(0, teamScore - points);
        handleTableScoreChange(matchPointsData.set_number, team_type, newScore);
    };

    return (
        <div className="grid gap-4">
            {scoringPoints?.length === 1 ? (
                <div className="grid grid-cols-2 justify-center gap-4 col-span-2">
                    <Button className="py-6" onClick={() => addScore(scoringPoints[0].point)}>
                        <Plus className="size-6" />
                    </Button>
                    <Button className="py-6" onClick={() => subtractScore(scoringPoints[0].point)}>
                        <Minus className="size-6" />
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-2 justify-center gap-4 col-span-2">
                    <div className="grid-cols-2 grid gap-4 col-span-2">
                        {scoringPoints?.map(point => (
                            <Button variant="outline" key={point.scoring_point_id} className="w-full text-lg font-bold py-6"
                                onClick={() => addScore(point.point)}>
                                + {point.point}</Button>
                        ))}
                    </div>
                    <Button className="py-6 col-span-2" onClick={() => subtractScore(1)}>
                        <Minus className="size-6" />
                    </Button>
                </div>
            )}
            {penalties && <Separator className="col-span-2" />}
            {penalties?.map(penalty =>
                <div key={penalty?.penalty_id} className="col-span-2 grid grid-cols-2 w-full gap-4">
                    <Button variant="outline" className="py-6"
                        onClick={() => {
                            if (penalty?.affects_score) {
                                if (teamScore > 0) {
                                    const newScore = Math.max(0, teamScore - penalty?.penalty_point);
                                    handleTableScoreChange(matchPointsData.set_number, team_type, newScore);
                                    changeMinusPenalty(minusPenalty + penalty?.penalty_point);
                                }
                            } else {
                                changeRegularPenalty(regularPenalty + penalty?.penalty_point)
                            }
                        }} >
                        {penalty?.penalty_name} (-1)
                    </Button>
                    <Button variant="outline" className="py-6"
                        onClick={() => {
                            if (penalty?.affects_score) {
                                if (minusPenalty === 0) return;
                                changeMinusPenalty(minusPenalty - penalty?.penalty_point);
                                const newScore = teamScore + penalty?.penalty_point;
                                handleTableScoreChange(matchPointsData.set_number, team_type, newScore);
                            } else {
                                if (regularPenalty > 0) {
                                    changeRegularPenalty(regularPenalty - penalty?.penalty_point);
                                }
                            }
                        }} >
                        <Minus className="size-5" />
                    </Button>
                </div>
            )}
        </div>
    )
}