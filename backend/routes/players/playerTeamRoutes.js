import express from "express";
import {
    getPlayerTeams,
    getPlayerTeamsByTeam,
    createPlayerTeam,
    updatePlayerTeam,
    deletePlayerTeam,
    checkPlayerTeamExists
} from "../../controllers/players/playerTeamController.js";

const router = express.Router();

router.get("/", getPlayerTeams);
router.get("/by-team/:teamId", getPlayerTeamsByTeam);
router.get("/check/:playerId/:teamId", checkPlayerTeamExists);
router.post("/", createPlayerTeam);
router.put("/:id", updatePlayerTeam);
router.delete("/:id", deletePlayerTeam);

export default router;