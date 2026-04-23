import express from "express";
import {
    getPlayerStats,
    getPlayerStatsByMatch,
    getPlayerStatsByPlayer,
    getPlayerStatsByMatchAndPlayer,
    createPlayerStats,
    updatePlayerStats,
    deletePlayerStats
} from "../../controllers/players/playerStatsController.js";

const router = express.Router();

router.get("/", getPlayerStats);
router.get("/match/:match_id", getPlayerStatsByMatch);
router.get("/player/:player_id", getPlayerStatsByPlayer);
router.get("/match/:match_id/player/:player_id", getPlayerStatsByMatchAndPlayer);
router.post("/", createPlayerStats);
router.put("/:entry_id", updatePlayerStats);
router.delete("/:entry_id", deletePlayerStats);

export default router;