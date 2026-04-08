import * as tournamentTeamsRepo from "../../repositories/tournaments/tournamentTeamsRepo.js";
import { AppError } from "../../middleware/errorHandler.js";

export const getTournamentTeams = async (req, res, next) => {
    try {
        const teams = await tournamentTeamsRepo.findByTournament(req.params.tournament_id);
        res.status(200).json({ success: true, data: teams });
    } catch (error) { next(error); }
};

export const createTournamentTeam = async (req, res, next) => {
    try {
        const team = await tournamentTeamsRepo.create(req.body);
        res.status(201).json({ success: true, data: team });
    } catch (error) { next(error); }
};

export const updateTournamentTeam = async (req, res, next) => {
    try {
        const team = await tournamentTeamsRepo.update(req.params.id, req.body);
        if (!team) throw new AppError("Tournament team not found", 404);
        res.status(200).json({ success: true, data: team });
    } catch (error) { next(error); }
};

export const deleteTournamentTeam = async (req, res, next) => {
    try {
        const team = await tournamentTeamsRepo.remove(req.params.id);
        if (!team) throw new AppError("Tournament team not found", 404);
        res.status(200).json({ success: true, data: team });
    } catch (error) { next(error); }
};
