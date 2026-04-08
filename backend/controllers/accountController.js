import * as accountRepo from "../repositories/accountRepo.js";
import { AppError } from "../middleware/errorHandler.js";

export const getAccounts = async (req, res, next) => {
    try {
        const accounts = await accountRepo.findAll();
        res.status(200).json({ success: true, data: accounts });
    } catch (error) {
        next(error);
    }
};

export const createAccount = async (req, res, next) => {
    try {
        const account = await accountRepo.create(req.body);
        res.status(201).json({ success: true, data: account });
    } catch (error) {
        next(error);
    }
};

export const updateAccount = async (req, res, next) => {
    try {
        const account = await accountRepo.update(req.params.id, req.body);
        if (!account) {
            throw new AppError("Account not found", 404);
        }
        res.status(200).json({ success: true, data: account });
    } catch (error) {
        next(error);
    }
};

export const deleteAccount = async (req, res, next) => {
    try {
        const account = await accountRepo.softDelete(req.params.id);
        if (!account) {
            throw new AppError("Account not found", 404);
        }
        res.status(200).json({ success: true, data: account });
    } catch (error) {
        next(error);
    }
};