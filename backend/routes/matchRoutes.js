import express from "express"
import { 
    getMatches, 
    getMatchesById, 
    getMatchesBySport,
    createMatch, 
    updateMatch, 
    deleteMatch } 
from "../controllers/matchController.js"

const router = express.Router();

router.get("/", getMatches);
router.get("/:match_id", getMatchesById);
router.get("/:sport_id", getMatchesBySport);
router.post("/", createMatch);
router.put("/:match_id", updateMatch);
router.delete("/:match_id", deleteMatch);

export default router;
