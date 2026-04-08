import express from "express";
import { validate } from "../middleware/validate.js";
import { createTeamSchema } from "../validators/teamSchema.js";
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
router.post("/", validate(createTeamSchema), createTeam);
router.put("/:id", updateTeam);
router.delete("/:id", deleteTeam);

export default router;