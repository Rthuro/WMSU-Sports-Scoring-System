import * as scoringPointsRepo from "../../repositories/sports/scoringPointsRepo.js";
import { AppError } from "../../middleware/errorHandler.js";

export const getSportScoringPoints = async (req, res, next) => {
    try {
        const points = await scoringPointsRepo.findBySport(req.params.sportId);
        res.status(200).json({ success: true, data: points });
    } catch (error) { next(error); }
};

export const createSportScoringPoints = async (req, res, next) => {
    try {
        const point = await scoringPointsRepo.create(req.body);
        res.status(201).json({ success: true, data: point });
    } catch (error) { next(error); }
};

export const updateSportScoringPoints = async (req, res, next) => {
    try {
        const point = await scoringPointsRepo.update(req.params.id, req.body);
        if (!point) throw new AppError("Scoring point not found", 404);
        res.status(200).json({ success: true, data: point });
    } catch (error) { next(error); }
};

export const deleteSportScoringPoints = async (req, res, next) => {
    try {
        const point = await scoringPointsRepo.remove(req.params.id);
        if (!point) throw new AppError("Scoring point not found", 404);
        res.status(200).json({ success: true, data: point });
    } catch (error) { next(error); }
};