import express from "express"
import {
    getSportScoringPoints,
    createSportScoringPoints,
    updateSportScoringPoints,
    deleteSportScoringPoints
} from "../../controllers/sports/scoringPointsController.js"

const router = express.Router();

router.get("/:sportId", getSportScoringPoints);
router.post("/", createSportScoringPoints);
router.put("/:id", updateSportScoringPoints);
router.delete("/:id", deleteSportScoringPoints);

export default router;