import express from "express";
import {
    getMatchesByDate,
    getAllMatches
} from "../../controllers/public/publicController.js";

const router = express.Router();

router.get("/date/:startDate/:endDate", getMatchesByDate);
router.get("/all", getAllMatches);

export default router;