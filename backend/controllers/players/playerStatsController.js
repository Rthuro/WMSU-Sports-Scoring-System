import * as playerStatsRepo from "../../repositories/players/playerStatsRepo.js";

export const getPlayerStats = async (req, res, next) => {
    try {
        const stats = await playerStatsRepo.findAll();
        res.status(200).json({ success: true, data: stats });
    } catch (error) { next(error); }
};

export const getMultiplePlayerStats = async (req, res, next) => {
    try {
        const stats = await playerStatsRepo.findMultiple(req.params.player_ids);
        res.status(200).json({ success: true, data: stats });
    } catch (error) { next(error); }
};

export const getPlayerStatsByMatch = async (req, res, next) => {
    try {
        const stats = await playerStatsRepo.findByMatch(req.params.match_id);
        res.status(200).json({ success: true, data: stats });
    } catch (error) { next(error); }
};

export const getPlayerStatsByPlayer = async (req, res, next) => {
    try {
        const stats = await playerStatsRepo.findByPlayer(req.params.player_id);
        res.status(200).json({ success: true, data: stats });
    } catch (error) { next(error); }
};

export const getPlayerStatsByMatchAndPlayer = async (req, res, next) => {
    try {
        const stats = await playerStatsRepo.findByMatchAndPlayer(req.params.match_id, req.params.player_id);
        res.status(200).json({ success: true, data: stats });
    } catch (error) { next(error); }
};

export const createPlayerStats = async (req, res, next) => {
    try {
        const stats = await playerStatsRepo.create(req.body);
        res.status(201).json({ success: true, data: stats });
    } catch (error) { next(error); }
};

export const updatePlayerStats = async (req, res, next) => {
    try {
        const stats = await playerStatsRepo.update(req.params.entry_id, req.body);
        res.status(200).json({ success: true, data: stats });
    } catch (error) { next(error); }
};

export const deletePlayerStats = async (req, res, next) => {
    try {
        const stats = await playerStatsRepo.deleteRecord(req.params.entry_id);
        res.status(200).json({ success: true, data: stats });
    } catch (error) { next(error); }
};