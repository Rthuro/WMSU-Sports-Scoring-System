import * as playerTeamRepo from "../../repositories/players/playerTeamRepo.js";
import { AppError } from "../../middleware/errorHandler.js";

export const getPlayerTeams = async (req, res, next) => {
    try {
        const teams = await playerTeamRepo.findAll();
        res.status(200).json({ success: true, data: teams });
    } catch (error) { next(error); }
};

export const getPlayerTeamsByTeam = async (req, res, next) => {
    try {
        const teams = await playerTeamRepo.findByTeam(req.params.teamId);
        res.status(200).json({ success: true, data: teams });
    } catch (error) { next(error); }
};

export const createPlayerTeam = async (req, res, next) => {
    try {
        const team = await playerTeamRepo.create(req.body);
        res.status(201).json({ success: true, data: team });
    } catch (error) { next(error); }
};

export const updatePlayerTeam = async (req, res, next) => {
    try {
        const team = await playerTeamRepo.update(req.params.id, req.body);
        if (!team) throw new AppError("Player team not found", 404);
        res.status(200).json({ success: true, data: team });
    } catch (error) { next(error); }
};

export const deletePlayerTeam = async (req, res, next) => {
    try {
        const team = await playerTeamRepo.remove(req.params.id);
        if (!team) throw new AppError("Player team not found", 404);
        res.status(200).json({ success: true, message: "Player team deleted successfully" });
    } catch (error) { next(error); }
};

export const checkPlayerTeamExists = async (req, res, next) => {
    try {
        const team = await playerTeamRepo.findByPlayerAndTeam(req.params.playerId, req.params.teamId);
        if (team) {
            return res.status(200).json({ success: true, data: team });
        }
        return res.status(404).json({ success: false, message: "Player team not found" });
    } catch (error) { next(error); }
};
