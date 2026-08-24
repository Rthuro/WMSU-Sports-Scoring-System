import * as articleTypeRepo from "../../repositories/public/articleTypeRepo.js";
import { AppError } from "../../middleware/errorHandler.js";

export const getArticleTypes = async (req, res, next) => {
    try {
        const articleTypes = await articleTypeRepo.findAll();
        res.status(200).json({ success: true, data: articleTypes });
    } catch (error) {
        next(error);
    }
};

export const getArticleTypeById = async (req, res, next) => {
    try {
        const articleType = await articleTypeRepo.findById(req.params.id);
        if (!articleType) {
            throw new AppError("Article not found", 404);
        }
        res.status(200).json({ success: true, data: articleType });
    } catch (error) {
        next(error);
    }
};

export const createArticleType = async (req, res, next) => {
    try {
        const articleType = await articleTypeRepo.create(req.body);
        res.status(201).json({ success: true, data: articleType });
    } catch (error) {
        next(error);
    }
};


export const updateArticleType = async (req, res, next) => {
    try {
        const articleType = await articleTypeRepo.update(req.params.id, req.body);
        if (!articleType) {
            throw new AppError("Article type not found", 404);
        }
        res.status(200).json({ success: true, data: articleType });
    } catch (error) {
        next(error);
    }
};

export const deleteArticleType = async (req, res, next) => {
    try {
        const articleType = await articleTypeRepo.deleteArticleType(req.params.id);
        if (!articleType) {
            throw new AppError("Article type not found", 404);
        }
        res.status(200).json({ success: true, data: articleType });
    } catch (error) {
        next(error);
    }
};