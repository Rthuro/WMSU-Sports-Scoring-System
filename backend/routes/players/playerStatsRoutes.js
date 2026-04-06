import express from "express";
import {
    getPlayerStats,
    getPlayerStatsByMatch
} from "../../controllers/players/playerStatsController.js";

const router = express.Router();

router.get("/", getPlayerStats);
router.get("/:match_id", getPlayerStatsByMatch);

export default router;