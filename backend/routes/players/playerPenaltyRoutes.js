import express from "express";
import {
    getPlayerPenalties,
    getPlayerPenaltiesByMatch,
    getPlayerPenaltiesByPlayer,
    getPlayerPenaltiesByMatchAndPlayer,
    createPlayerPenalties,
    updatePlayerPenalties,
    deletePlayerPenalties
} from "../../controllers/players/playerPenaltyController.js";

const router = express.Router();

router.get("/", getPlayerPenalties);
router.get("/match/:match_id", getPlayerPenaltiesByMatch);
router.get("/player/:player_id", getPlayerPenaltiesByPlayer);
router.get("/match/:match_id/player/:player_id", getPlayerPenaltiesByMatchAndPlayer);
router.post("/", createPlayerPenalties);
router.put("/:entry_id", updatePlayerPenalties);
router.delete("/:entry_id", deletePlayerPenalties);

export default router;