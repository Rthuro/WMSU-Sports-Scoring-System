import express from "express"
import {
    getSportStats,
    createStat,
    updateStat,
    deleteStat,
    getSportStatsBySportId,
} from "../../controllers/sports/statsController.js"

const router = express.Router();

router.get("/", getSportStats);
router.get("/sport/:sport_id", getSportStatsBySportId);
router.post("/", createStat);
router.put("/:id", updateStat);
router.delete("/:id", deleteStat);

export default router;