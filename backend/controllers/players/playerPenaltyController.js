import * as playerPenaltyRepo from "../../repositories/players/playerPenaltyRepo.js";

export const getPlayerPenalties = async (req, res, next) => {
    try {
        const stats = await playerPenaltyRepo.findAll();
        res.status(200).json({ success: true, data: stats });
    } catch (error) { next(error); }
};

export const getPlayerPenaltiesByMatch = async (req, res, next) => {
    try {
        const stats = await playerPenaltyRepo.findByMatch(req.params.match_id);
        res.status(200).json({ success: true, data: stats });
    } catch (error) { next(error); }
};

export const getPlayerPenaltiesByPlayer = async (req, res, next) => {
    try {
        const stats = await playerPenaltyRepo.findByPlayer(req.params.player_id);
        res.status(200).json({ success: true, data: stats });
    } catch (error) { next(error); }
};

export const getPlayerPenaltiesByMatchAndPlayer = async (req, res, next) => {
    try {
        const stats = await playerPenaltyRepo.findByMatchAndPlayer(req.params.match_id, req.params.player_id);
        res.status(200).json({ success: true, data: stats });
    } catch (error) { next(error); }
};

export const createPlayerPenalties = async (req, res, next) => {
    try {
        const stats = await playerPenaltyRepo.create(req.body);
        res.status(201).json({ success: true, data: stats });
    } catch (error) { next(error); }
};

export const updatePlayerPenalties = async (req, res, next) => {
    try {
        const stats = await playerPenaltyRepo.update(req.params.entry_id, req.body);
        res.status(200).json({ success: true, data: stats });
    } catch (error) { next(error); }
};

export const deletePlayerPenalties = async (req, res, next) => {
    try {
        const stats = await playerPenaltyRepo.deleteRecord(req.params.entry_id);
        res.status(200).json({ success: true, data: stats });
    } catch (error) { next(error); }
};