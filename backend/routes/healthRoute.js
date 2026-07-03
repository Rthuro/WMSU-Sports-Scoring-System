import express from "express"
import { getHealth } from "../repositories/healthRepo.js";   

const router = express.Router();

router.get("/", async (req, res) => {
    const health = await getHealth();
    
    // Check if DB is live
    if (health.status === "ok") {
        return res.status(200).json(health);
    } else {
        // Return a 503 Service Unavailable if the DB is down
        return res.status(503).json(health);
    }
});

export default router;