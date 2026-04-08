import * as matchParticipantsRepo from "../../repositories/matches/matchParticipantsRepo.js";

export const getMatchParticipants = async (req, res, next) => {
    try {
        const participants = await matchParticipantsRepo.findAll();
        res.status(200).json({ success: true, data: participants });
    } catch (error) { next(error); }
};

export const createMatchParticipants = async (req, res, next) => {
    try {
        const participant = await matchParticipantsRepo.create(req.body);
        res.status(201).json({ success: true, data: participant });
    } catch (error) { next(error); }
};
