import * as matchRepo from "../repositories/matchRepo.js";
import { AppError } from "../middleware/errorHandler.js";

export const getMatches = async (req, res, next) => {
    try {
        const matches = await matchRepo.findAll();
        res.status(200).json({ success: true, data: matches });
    } catch (error) {
        next(error);
    }
};

export const getMatchesById = async (req, res, next) => {
    try {
        const match = await matchRepo.findById(req.params.match_id);
        if (!match) {
            throw new AppError("Match not found", 404);
        }
        res.status(200).json({ success: true, data: match });
    } catch (error) {
        next(error);
    }
};

export const getMatchesBySport = async (req, res, next) => {
    try {
        const matches = await matchRepo.findBySport(req.params.sport_id);
        res.status(200).json({ success: true, data: matches });
    } catch (error) {
        next(error);
    }
};

export const createMatch = async (req, res, next) => {
    try {
        // Use transactional method that also creates participants
        const match = await matchRepo.createWithParticipants(req.body);
        res.status(201).json({ success: true, data: match });
    } catch (error) {
        next(error);
    }
};

export const updateMatch = async (req, res, next) => {
    try {
        const match = await matchRepo.update(req.params.match_id, req.body);
        if (!match) {
            throw new AppError("Match not found", 404);
        }
        res.status(200).json({ success: true, data: match });
    } catch (error) {
        next(error);
    }
};

export const deleteMatch = async (req, res, next) => {
    try {
        const match = await matchRepo.softDelete(req.params.match_id);
        if (!match) {
            throw new AppError("Match not found", 404);
        }
        res.status(200).json({ success: true, data: match });
    } catch (error) {
        next(error);
    }
};