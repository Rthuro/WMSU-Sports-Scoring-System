import express from "express"
import { validate } from "../middleware/validate.js";
import { createSportSchema } from "../validators/sportSchema.js";
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
router.post("/", validate(createSportSchema), createSport);
router.get("/:name", checkSportExists );
router.put("/:id", updateSport);
router.delete("/:id", deleteSport);

export default router;