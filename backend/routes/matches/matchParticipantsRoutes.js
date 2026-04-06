import express from "express";
import {
    getMatchParticipants,
    createMatchParticipants
} from "../../controllers/matches/matchParticipantsController.js";

const router = express.Router();

router.get("/", getMatchParticipants);
router.post("/", createMatchParticipants);

export default router;