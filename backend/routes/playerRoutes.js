import express from "express";
import {
    getPlayers,
    getPlayersBySport,
    createPlayer,
    updatePlayer,
    deletePlayer,   
    checkPlayerExists
} from "../controllers/playerController.js";

const router = express.Router();

router.get("/", getPlayers);
router.get("/:sportId", getPlayersBySport);
router.get("/:firstName/:lastName", checkPlayerExists);
router.post("/", createPlayer);
router.put("/:id", updatePlayer);
router.delete("/:id", deletePlayer);

export default router;