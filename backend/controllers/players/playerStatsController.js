import * as playerStatsRepo from "../../repositories/players/playerStatsRepo.js";

export const getPlayerStats = async (req, res, next) => {
    try {
        const stats = await playerStatsRepo.findAll();
        res.status(200).json({ success: true, data: stats });
    } catch (error) { next(error); }
};

export const getPlayerStatsByMatch = async (req, res, next) => {
    try {
        const stats = await playerStatsRepo.findByMatch(req.params.match_id);
        res.status(200).json({ success: true, data: stats });
    } catch (error) { next(error); }
};
