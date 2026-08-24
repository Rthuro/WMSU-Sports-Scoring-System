import express from "express";
import {
    getArticleTypes,
    getArticleTypeById,
    createArticleType,
    updateArticleType,
    deleteArticleType
} from "../../controllers/public/articleTypeController.js";

const router = express.Router();

router.get("/", getArticleTypes);
router.get("/:id", getArticleTypeById);
router.post("/", createArticleType);
router.put("/:id", updateArticleType);
router.delete("/:id", deleteArticleType);

export default router;

