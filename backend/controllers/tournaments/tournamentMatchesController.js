import * as tournamentMatchesRepo from "../../repositories/tournaments/tournamentMatchesRepo.js";
import { AppError } from "../../middleware/errorHandler.js";

export const getTournamentMatches = async (req, res, next) => {
    try {
        const matches = await tournamentMatchesRepo.findByTournament(req.params.tournament_id);
        res.status(200).json({ success: true, data: matches });
    } catch (error) { next(error); }
};

export const getTournamentMatch = async (req, res, next) => {
    try {
        const match = await tournamentMatchesRepo.findById(req.params.match_id);
        if (!match) throw new AppError("Tournament match not found", 404);
        res.status(200).json({ success: true, data: match });
    } catch (error) { next(error); }
};

export const createTournamentMatch = async (req, res, next) => {
    try {
        const match = await tournamentMatchesRepo.create(req.body);
        res.status(201).json({ success: true, data: match });
    } catch (error) { next(error); }
};

export const updateTournamentMatch = async (req, res, next) => {
    try {
        const match = await tournamentMatchesRepo.update(req.params.id, req.body);
        if (!match) throw new AppError("Tournament match not found", 404);
        res.status(200).json({ success: true, data: match });
    } catch (error) { next(error); }
};

export const deleteTournamentMatch = async (req, res, next) => {
    try {
        const match = await tournamentMatchesRepo.remove(req.params.id);
        if (!match) throw new AppError("Tournament match not found", 404);
        res.status(200).json({ success: true, data: match });
    } catch (error) { next(error); }
};

export const softDeleteTournamentMatch = async (req, res, next) => {
    try {
        const match = await tournamentMatchesRepo.softDelete(req.params.id);
        if (!match) throw new AppError("Tournament match not found", 404);
        res.status(200).json({ success: true, data: match });
    } catch (error) { next(error); }
};
