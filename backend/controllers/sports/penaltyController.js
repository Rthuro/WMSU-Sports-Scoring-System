import * as penaltyRepo from "../../repositories/sports/penaltyRepo.js";
import { AppError } from "../../middleware/errorHandler.js";

export const getSportPenalties = async (req, res, next) => {
    try {
        const penalties = await penaltyRepo.findBySport(req.params.sportId);
        res.status(200).json({ success: true, data: penalties });
    } catch (error) { next(error); }
};

export const createPenalty = async (req, res, next) => {
    try {
        const penalty = await penaltyRepo.create(req.body);
        res.status(201).json({ success: true, data: penalty });
    } catch (error) { next(error); }
};

export const updatePenalty = async (req, res, next) => {
    try {
        const penalty = await penaltyRepo.update(req.params.id, req.body);
        if (!penalty) throw new AppError("Penalty not found", 404);
        res.status(200).json({ success: true, data: penalty });
    } catch (error) { next(error); }
};

export const deletePenalty = async (req, res, next) => {
    try {
        const penalty = await penaltyRepo.remove(req.params.id);
        if (!penalty) throw new AppError("Penalty not found", 404);
        res.status(200).json({ success: true, data: penalty });
    } catch (error) { next(error); }
};