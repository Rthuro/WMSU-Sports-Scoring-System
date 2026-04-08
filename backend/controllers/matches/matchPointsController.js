import * as matchPointsRepo from "../../repositories/matches/matchPointsRepo.js";

export const getMatchesPoints = async (req, res, next) => {
    try {
        const points = await matchPointsRepo.findAll();
        res.status(200).json({ success: true, data: points });
    } catch (error) { next(error); }
};

export const getMatchPointsByMatchId = async (req, res, next) => {
    try {
        const points = await matchPointsRepo.findByMatch(req.params.match_id);
        res.status(200).json({ success: true, data: points });
    } catch (error) { next(error); }
};

export const createMatchPoints = async (req, res, next) => {
    try {
        const point = await matchPointsRepo.create(req.body);
        res.status(200).json({ success: true, data: point });
    } catch (error) { next(error); }
};

export const updateMatchPoints = async (req, res, next) => {
    try {
        const point = await matchPointsRepo.update(req.body);
        res.status(200).json({ success: true, data: point });
    } catch (error) { next(error); }
};
