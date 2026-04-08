import * as tournamentRepo from "../repositories/tournamentRepo.js";
import { AppError } from "../middleware/errorHandler.js";

export const getTournaments = async (req, res, next) => {
    try {
        const tournaments = await tournamentRepo.findAll();
        res.status(200).json({ success: true, data: tournaments });
    } catch (error) {
        next(error);
    }
};

export const getTournamentById = async (req, res, next) => {
    try {
        const tournament = await tournamentRepo.findById(req.params.id);
        if (!tournament) {
            throw new AppError("Tournament not found", 404);
        }
        res.status(200).json({ success: true, data: tournament });
    } catch (error) {
        next(error);
    }
};

export const getTournamentBySport = async (req, res, next) => {
    try {
        const tournaments = await tournamentRepo.findBySport(req.params.sport_id);
        res.status(200).json({ success: true, data: tournaments });
    } catch (error) {
        next(error);
    }
};

export const getTournamentsByEvent = async (req, res, next) => {
    try {
        const tournaments = await tournamentRepo.findByEvent(req.params.event_id);
        res.status(200).json({ success: true, data: tournaments });
    } catch (error) {
        next(error);
    }
};

export const createTournament = async (req, res, next) => {
    try {
        // Use transactional method that creates teams, tally, and bracket matches
        const hasTeams = req.body.teams && req.body.teams.length > 0;
        let tournament;
        if (hasTeams) {
            tournament = await tournamentRepo.createWithTeamsAndMatches(req.body);
        } else {
            tournament = await tournamentRepo.create(req.body);
        }
        res.status(201).json({ success: true, data: tournament });
    } catch (error) {
        next(error);
    }
};

export const updateTournament = async (req, res, next) => {
    try {
        const tournament = await tournamentRepo.update(req.params.id, req.body);
        if (!tournament) {
            throw new AppError("Tournament not found", 404);
        }
        res.status(200).json({ success: true, data: tournament });
    } catch (error) {
        next(error);
    }
};

export const deleteTournament = async (req, res, next) => {
    try {
        const tournament = await tournamentRepo.softDelete(req.params.id);
        if (!tournament) {
            throw new AppError("Tournament not found", 404);
        }
        res.status(200).json({ success: true, data: tournament });
    } catch (error) {
        next(error);
    }
};
