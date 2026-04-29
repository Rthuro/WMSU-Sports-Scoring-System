import express from "express";
import {
    getMatchesByDate,
    getAllMatches,
    getPublicEvents,
    getPublicTournaments
} from "../../controllers/public/publicController.js";

const router = express.Router();

router.get("/date/:startDate/:endDate", getMatchesByDate);
router.get("/all", getAllMatches);
router.get("/events", getPublicEvents);
router.get("/tournaments", getPublicTournaments);

export default router;