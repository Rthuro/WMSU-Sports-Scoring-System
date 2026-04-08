import * as sportRepo from "../repositories/sportRepo.js";
import { AppError } from "../middleware/errorHandler.js";

export const getSports = async (req, res, next) => {
    try {
        const sports = await sportRepo.findAll();
        res.status(200).json({ success: true, data: sports });
    } catch (error) {
        next(error);
    }
};

export const getSportById = async (req, res, next) => {
    try {
        const sport = await sportRepo.findById(req.params.id);
        if (!sport) {
            throw new AppError("Sport not found", 404);
        }
        res.status(200).json({ success: true, data: sport });
    } catch (error) {
        next(error);
    }
};

export const createSport = async (req, res, next) => {
    try {
        // If sub-resources are included, use the transactional method
        const hasSubResources = req.body.set_rules?.length || req.body.scoring_points?.length ||
            req.body.penalties?.length || req.body.stats?.length || req.body.positions?.length;

        let sport;
        if (hasSubResources) {
            sport = await sportRepo.createWithSubResources(req.body);
        } else {
            sport = await sportRepo.create(req.body);
        }

        res.status(201).json({ success: true, data: sport });
    } catch (error) {
        next(error);
    }
};

export const updateSport = async (req, res, next) => {
    try {
        const sport = await sportRepo.update(req.params.id, req.body);
        if (!sport) {
            throw new AppError("Sport not found", 404);
        }
        res.status(200).json({ success: true, data: sport });
    } catch (error) {
        next(error);
    }
};

export const deleteSport = async (req, res, next) => {
    try {
        const sport = await sportRepo.softDelete(req.params.id);
        if (!sport) {
            throw new AppError("Sport not found", 404);
        }
        res.status(200).json({ success: true, data: sport });
    } catch (error) {
        next(error);
    }
};

export const checkSportExists = async (req, res, next) => {
    try {
        const sport = await sportRepo.findByName(req.params.name);
        if (sport) {
            return res.status(200).json({ success: true, data: sport });
        }
        return res.status(200).json({ success: false });
    } catch (error) {
        next(error);
    }
};
