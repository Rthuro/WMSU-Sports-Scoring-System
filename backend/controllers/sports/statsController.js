import * as statsRepo from "../../repositories/sports/statsRepo.js";
import { AppError } from "../../middleware/errorHandler.js";

export const getSportStats = async (req, res, next) => {
    try {
        const stats = await statsRepo.findAll();
        res.status(200).json({ success: true, data: stats });
    } catch (error) { next(error); }
};

export const createStat = async (req, res, next) => {
    try {
        const stat = await statsRepo.create(req.body);
        res.status(201).json({ success: true, data: stat });
    } catch (error) { next(error); }
};

export const updateStat = async (req, res, next) => {
    try {
        const stat = await statsRepo.update(req.params.id, req.body);
        if (!stat) throw new AppError("Stat not found", 404);
        res.status(200).json({ success: true, data: stat });
    } catch (error) { next(error); }
};

export const deleteStat = async (req, res, next) => {
    try {
        const stat = await statsRepo.remove(req.params.id);
        if (!stat) throw new AppError("Stat not found", 404);
        res.status(200).json({ success: true, data: stat });
    } catch (error) { next(error); }
};