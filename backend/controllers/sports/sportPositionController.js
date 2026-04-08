import * as sportPositionRepo from "../../repositories/sports/sportPositionRepo.js";
import { AppError } from "../../middleware/errorHandler.js";

export const getSportPositions = async (req, res, next) => {
    try {
        const positions = await sportPositionRepo.findBySport(req.params.sportId);
        res.status(200).json({ success: true, data: positions });
    } catch (error) { next(error); }
};

export const createSportPosition = async (req, res, next) => {
    try {
        const position = await sportPositionRepo.create(req.body);
        res.status(201).json({ success: true, data: position });
    } catch (error) { next(error); }
};

export const updateSportPosition = async (req, res, next) => {
    try {
        const position = await sportPositionRepo.update(req.params.id, req.body);
        if (!position) throw new AppError("Sport position not found", 404);
        res.status(200).json({ success: true, data: position });
    } catch (error) { next(error); }
};

export const deleteSportPosition = async (req, res, next) => {
    try {
        const position = await sportPositionRepo.remove(req.params.id);
        if (!position) throw new AppError("Sport position not found", 404);
        res.status(200).json({ success: true, data: position });
    } catch (error) { next(error); }
};