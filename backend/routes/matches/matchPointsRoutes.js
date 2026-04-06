import express from "express";
import {
    getMatchesPoints,
    getMatchPointsByMatchId,
    createMatchPoints,
    updateMatchPoints
} from "../../controllers/matches/matchPointsController.js";

const router = express.Router();

router.get("/", getMatchesPoints);
router.get("/match/:match_id", getMatchPointsByMatchId);
router.post("/", createMatchPoints);
router.put("/", updateMatchPoints);

export default router;