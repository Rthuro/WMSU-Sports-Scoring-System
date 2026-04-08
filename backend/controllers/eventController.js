import * as eventRepo from "../repositories/eventRepo.js";
import { AppError } from "../middleware/errorHandler.js";

export const getEvents = async (req, res, next) => {
    try {
        const events = await eventRepo.findAll();
        res.status(200).json({ success: true, data: events });
    } catch (error) {
        next(error);
    }
};

export const getEventById = async (req, res, next) => {
    try {
        const event = await eventRepo.findById(req.params.id);
        if (!event) {
            throw new AppError("Event not found", 404);
        }
        res.status(200).json({ success: true, data: event });
    } catch (error) {
        next(error);
    }
};

export const createEvent = async (req, res, next) => {
    try {
        const event = await eventRepo.create(req.body);
        res.status(201).json({ success: true, data: event });
    } catch (error) {
        next(error);
    }
};

export const updateEvent = async (req, res, next) => {
    try {
        const event = await eventRepo.update(req.params.id, req.body);
        if (!event) {
            throw new AppError("Event not found", 404);
        }
        res.status(200).json({ success: true, data: event });
    } catch (error) {
        next(error);
    }
};

export const deleteEvent = async (req, res, next) => {
    try {
        const event = await eventRepo.softDelete(req.params.id);
        if (!event) {
            throw new AppError("Event not found", 404);
        }
        res.status(200).json({ success: true, data: event });
    } catch (error) {
        next(error);
    }
};