import express from "express"
import {
    getSportPenalties,
    createPenalty,
    updatePenalty,
    deletePenalty
} from "../../controllers/sports/penaltyController.js"

const router = express.Router();

router.get("/:sportId", getSportPenalties);
router.post("/", createPenalty);
router.put("/:id", updatePenalty);
router.delete("/:id", deletePenalty);

export default router;