import * as teamRepo from "../repositories/teamRepo.js";
import { AppError } from "../middleware/errorHandler.js";

export const getTeams = async (req, res, next) => {
    try {
        const teams = await teamRepo.findAll();
        res.status(200).json({ success: true, data: teams });
    } catch (error) {
        next(error);
    }
};

export const getTeamsBySport = async (req, res, next) => {
    try {
        const teams = await teamRepo.findBySport(req.params.sportId);
        res.status(200).json({ success: true, data: teams });
    } catch (error) {
        next(error);
    }
};

export const createTeam = async (req, res, next) => {
    try {
        // Use transactional method that also assigns players
        const hasPlayers = req.body.players && req.body.players.length > 0;
        let team;
        if (hasPlayers) {
            team = await teamRepo.createWithPlayers(req.body);
        } else {
            team = await teamRepo.create(req.body);
        }
        res.status(201).json({ success: true, data: team });
    } catch (error) {
        next(error);
    }
};

export const updateTeam = async (req, res, next) => {
    try {
        const team = await teamRepo.update(req.params.id, req.body);
        if (!team) {
            throw new AppError("Team not found", 404);
        }
        res.status(200).json({ success: true, data: team });
    } catch (error) {
        next(error);
    }
};

export const deleteTeam = async (req, res, next) => {
    try {
        const team = await teamRepo.softDelete(req.params.id);
        if (!team) {
            throw new AppError("Team not found", 404);
        }
        res.status(200).json({ success: true, message: "Team deleted successfully" });
    } catch (error) {
        next(error);
    }
};

export const getTeamProfile = async (req, res, next) => {
    try {
        const profile = await teamRepo.findProfileById(req.params.type, req.params.id);
        if (!profile) {
            throw new AppError("Team profile not found", 404);
        }
        res.status(200).json({ success: true, data: profile });
    } catch (error) {
        next(error);
    }
};
