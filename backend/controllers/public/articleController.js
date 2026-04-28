import * as articleRepo from "../../repositories/public/articleRepo.js";
import { AppError } from "../../middleware/errorHandler.js";

export const getArticles = async (req, res, next) => {
    try {
        const articles = await articleRepo.findAll();
        res.status(200).json({ success: true, data: articles });
    } catch (error) {
        next(error);
    }
};

export const getPublicArticles = async (req, res, next) => {
    try {
        const articles = await articleRepo.findAllPublic();
        res.status(200).json({ success: true, data: articles });
    } catch (error) {
        next(error);
    }
};

export const getArticleById = async (req, res, next) => {
    try {
        const article = await articleRepo.findById(req.params.id);
        if (!article) {
            throw new AppError("Article not found", 404);
        }
        res.status(200).json({ success: true, data: article });
    } catch (error) {
        next(error);
    }
};

export const createArticle = async (req, res, next) => {
    try {
        const article = await articleRepo.create(req.body);
        res.status(201).json({ success: true, data: article });
    } catch (error) {
        next(error);
    }
};

export const updateArticle = async (req, res, next) => {
    try {
        const article = await articleRepo.update(req.params.id, req.body);
        if (!article) {
            throw new AppError("Article not found", 404);
        }
        res.status(200).json({ success: true, data: article });
    } catch (error) {
        next(error);
    }
};

export const deleteArticle = async (req, res, next) => {
    try {
        const article = await articleRepo.deleteArticle(req.params.id);
        if (!article) {
            throw new AppError("Article not found", 404);
        }
        res.status(200).json({ success: true, data: article });
    } catch (error) {
        next(error);
    }
};