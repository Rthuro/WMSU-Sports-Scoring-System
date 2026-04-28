import * as publicRepo from "../../repositories/public/publicRepo.js";
import { AppError } from "../../middleware/errorHandler.js";

export const getMatchesByDate = async (req, res, next) => {
    try {
        const { startDate, endDate } = req.params;
        const matches = await publicRepo.findByDateRange(startDate, endDate);
        res.status(200).json({ success: true, data: matches });
    } catch (error) {
        next(error);
    }
};

export const getAllMatches = async (req, res, next) => {
    try {
        const matches = await publicRepo.findMatchWithPoints();
        res.status(200).json({ success: true, data: matches });
    } catch (error) {
        next(error);
    }
};