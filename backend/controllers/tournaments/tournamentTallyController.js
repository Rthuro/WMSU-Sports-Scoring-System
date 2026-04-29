import * as tournamentTallyRepo from "../../repositories/tournaments/tournamentTallyRepo.js";
import { AppError } from "../../middleware/errorHandler.js";
import { getIO } from "../../socketManager.js";

export const getTournamentTally = async (req, res, next) => {
    try {
        const tally = await tournamentTallyRepo.findAll();
        res.status(200).json({ success: true, data: tally });
    } catch (error) { next(error); }
};

export const createTournamentTally = async (req, res, next) => {
    try {
        const tally = await tournamentTallyRepo.create(req.body);
        res.status(201).json({ success: true, data: tally });
    } catch (error) { next(error); }
};

export const updateTournamentTally = async (req, res, next) => {
    try {
        const tally = await tournamentTallyRepo.update(req.params.tournament_id, req.params.team_id, req.body);
        if (!tally) throw new AppError("Tally not found", 404);
        res.status(200).json({ success: true, data: tally });

        // Broadcast to tournament room
        const io = getIO();
        io.to(`tournament:${req.params.tournament_id}`).emit("tally:updated", tally);
    } catch (error) { next(error); }
};

export const deleteTournamentTally = async (req, res, next) => {
    try {
        const tally = await tournamentTallyRepo.remove(req.params.tally_id);
        if (!tally) throw new AppError("Tally not found", 404);
        res.status(200).json({ success: true, message: "Tally deleted successfully" });
    } catch (error) { next(error); }
};