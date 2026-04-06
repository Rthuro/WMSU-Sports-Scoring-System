import express from "express"
import {
    getSportPositions,
    createSportPosition,
    updateSportPosition,
    deleteSportPosition
} from "../../controllers/sports/sportPositionController.js"

const router = express.Router();

router.get("/:sportId", getSportPositions);
router.post("/", createSportPosition,);
router.put("/:id", updateSportPosition);
router.delete("/:id", deleteSportPosition);

export default router;