import express from "express";
import {
    getTeams,
    getTeamsBySport,
    createTeam, 
    updateTeam,
    deleteTeam,
} from "../controllers/teamController.js";

const router = express.Router();

router.get("/", getTeams);
router.get("/:sportId", getTeamsBySport);
router.post("/", createTeam);
router.put("/:id", updateTeam);
router.delete("/:id", deleteTeam);

export default router;