import express from "express";
import {
    getTournamentMatches,
    getTournamentMatch,
    createTournamentMatch,
    updateTournamentMatch,
    deleteTournamentMatch
} from "../../controllers/tournaments/tournamentMatchesController.js";
const router = express.Router();

router.get("/:tournament_id", getTournamentMatches);
router.get("/match/:match_id", getTournamentMatch);
router.post("/", createTournamentMatch);
router.put("/:id", updateTournamentMatch);
router.delete("/:id", deleteTournamentMatch);

export default router;
