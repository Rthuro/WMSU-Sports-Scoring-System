import express from "express"
import {
    getTournamentTally,
    createTournamentTally,
    updateTournamentTally,
    deleteTournamentTally
} from "../../controllers/tournaments/tournamentTallyController.js"

const router = express.Router()

router.get("/", getTournamentTally);
router.post("/", createTournamentTally);
router.put("/:tournament_id/:team_id", updateTournamentTally);
router.delete("/:tally_id", deleteTournamentTally);

export default router;
