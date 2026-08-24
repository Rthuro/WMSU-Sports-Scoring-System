import express from "express"
import {
    getAccounts,
    createAccount,
    updateAccount,
    deleteAccount,
    login,
    signup,
    googleAuth,
    getEmail
} from "../controllers/accountController.js"

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/google", googleAuth);
router.get("/", getAccounts);
router.post("/", createAccount);
router.put("/:id", updateAccount);
router.delete("/:id", deleteAccount);
router.get("/validate/:email", getEmail);

export default router;
