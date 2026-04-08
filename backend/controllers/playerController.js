import * as playerRepo from "../repositories/playerRepo.js";
import { AppError } from "../middleware/errorHandler.js";

export const getPlayers = async (req, res, next) => {
    try {
        const players = await playerRepo.findAll();
        res.status(200).json({ success: true, data: players });
    } catch (error) {
        next(error);
    }
};

export const getPlayersBySport = async (req, res, next) => {
    try {
        const players = await playerRepo.findBySport(req.params.sportId);
        res.status(200).json({ success: true, data: players });
    } catch (error) {
        next(error);
    }
};

export const createPlayer = async (req, res, next) => {
    try {
        const player = await playerRepo.create(req.body);
        res.status(201).json({ success: true, data: player });
    } catch (error) {
        next(error);
    }
};

export const updatePlayer = async (req, res, next) => {
    try {
        const player = await playerRepo.update(req.params.id, req.body);
        if (!player) {
            throw new AppError("Player not found", 404);
        }
        res.status(200).json({ success: true, data: player });
    } catch (error) {
        next(error);
    }
};

export const deletePlayer = async (req, res, next) => {
    try {
        const player = await playerRepo.softDelete(req.params.id);
        if (!player) {
            throw new AppError("Player not found", 404);
        }
        res.status(200).json({ success: true, message: "Player deleted successfully" });
    } catch (error) {
        next(error);
    }
};

export const checkPlayerExists = async (req, res, next) => {
    try {
        const player = await playerRepo.findByName(req.params.firstName, req.params.lastName);
        if (player) {
            return res.status(200).json({ success: true, data: player });
        }
        return res.status(404).json({ success: false, message: "Player not found" });
    } catch (error) {
        next(error);
    }
};