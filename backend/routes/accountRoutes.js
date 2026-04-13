import express from "express"
import {
    getAccounts,
    createAccount,
    updateAccount,
    deleteAccount,
    login,
    signup
} from "../controllers/accountController.js"

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/", getAccounts);
router.post("/", createAccount);
router.put("/:id", updateAccount);
router.delete("/:id", deleteAccount);

export default router;
