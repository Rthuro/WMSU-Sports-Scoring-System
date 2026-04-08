import * as setRulesRepo from "../../repositories/sports/setRulesRepo.js";
import { AppError } from "../../middleware/errorHandler.js";

export const getSetRules = async (req, res, next) => {
    try {
        const rules = await setRulesRepo.findBySport(req.params.sportId);
        res.status(200).json({ success: true, data: rules });
    } catch (error) { next(error); }
};

export const createSetRule = async (req, res, next) => {
    try {
        const rule = await setRulesRepo.create(req.body);
        res.status(201).json({ success: true, data: rule });
    } catch (error) { next(error); }
};

export const updateSetRule = async (req, res, next) => {
    try {
        const rule = await setRulesRepo.update(req.params.id, req.body);
        if (!rule) throw new AppError("Set rule not found", 404);
        res.status(200).json({ success: true, data: rule });
    } catch (error) { next(error); }
};

export const deleteSetRule = async (req, res, next) => {
    try {
        const rule = await setRulesRepo.remove(req.params.id);
        if (!rule) throw new AppError("Set rule not found", 404);
        res.status(200).json({ success: true, data: rule });
    } catch (error) { next(error); }
};