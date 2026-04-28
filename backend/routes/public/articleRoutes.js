import express from "express";
import {
    getArticles,
    getPublicArticles,
    getArticleById,
    createArticle,
    updateArticle,
    deleteArticle
} from "../../controllers/public/articleController.js";

const router = express.Router();

router.get("/", getArticles);
router.get("/public", getPublicArticles);
router.get("/:id", getArticleById);
router.post("/", createArticle);
router.put("/:id", updateArticle);
router.delete("/:id", deleteArticle);

export default router;

