import express from "express"
import {
    getSportStats,
    createStat,
    updateStat,
    deleteStat
} from "../../controllers/sports/statsController.js"

const router = express.Router();

router.get("/", getSportStats);
router.post("/", createStat);
router.put("/:id", updateStat);
router.delete("/:id", deleteStat);

export default router;