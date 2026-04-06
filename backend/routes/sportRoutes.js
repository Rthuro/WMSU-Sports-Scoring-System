import express from "express"
import {
    getSports,
    getSportById,
    createSport,
    updateSport,
    deleteSport,
    checkSportExists
} from "../controllers/sportController.js"

const router = express.Router();

router.get("/", getSports);
router.get("/:id", getSportById);
router.post("/", createSport);
router.get("/:name", checkSportExists );
router.put("/:id", updateSport);
router.delete("/:id", deleteSport);

export default router;