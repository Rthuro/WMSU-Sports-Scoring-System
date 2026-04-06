import express from "express"
import {
    getSetRules,
    createSetRule,
    updateSetRule,
    deleteSetRule
} from "../../controllers/sports/setRulesController.js"

const router = express.Router();

router.get("/:sportId", getSetRules);
router.post("/", createSetRule,);
router.put("/:id", updateSetRule);
router.delete("/:id", deleteSetRule);

export default router;