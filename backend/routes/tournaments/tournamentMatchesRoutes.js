import express from "express";
import {
    getTournamentMatches,
    getTournamentMatch,
    createTournamentMatch,
    updateTournamentMatch,
    deleteTournamentMatch,
    softDeleteTournamentMatch
} from "../../controllers/tournaments/tournamentMatchesController.js";
const router = express.Router();

router.get("/:tournament_id", getTournamentMatches);
router.get("/match/:match_id", getTournamentMatch);
router.post("/", createTournamentMatch);
router.put("/:id", updateTournamentMatch);
router.delete("/:id", deleteTournamentMatch);
router.put("/soft/:id", softDeleteTournamentMatch);

export default router;
