import * as accountRepo from "../repositories/accountRepo.js";
import { AppError } from "../middleware/errorHandler.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

export const getAccounts = async (req, res, next) => {
    try {
        const accounts = await accountRepo.findAll();
        res.status(200).json({ success: true, data: accounts });
    } catch (error) {
        next(error);
    }
};

export const signup = async (req, res, next) => {
    try {
        const { firstName, lastName, email, passwordHash, role } = req.body;

        const existingUser = await accountRepo.findByEmail(email);
        if (existingUser) {
            throw new AppError("Email already registered", 400);
        }

        const hashedPassword = await bcrypt.hash(passwordHash, 10);

        const account = await accountRepo.create({
            firstName,
            lastName,
            middleName: "",
            email,
            passwordHash: hashedPassword,
            role: role || "admin"
        });

        const token = jwt.sign(
            { accountId: account.account_id, email: account.email, role: account.role },
            JWT_SECRET,
            { expiresIn: "7d" }
        );

        const userData = {
            account_id: account.account_id,
            first_name: account.first_name,
            last_name: account.last_name,
            email: account.email,
            role: account.role
        };

        res.status(201).json({
            success: true,
            data: { token, user: userData }
        });
    } catch (error) {
        next(error);
    }
};

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const account = await accountRepo.findByEmail(email);
        if (!account) {
            throw new AppError("Invalid email or password", 401);
        }

        const isValidPassword = await bcrypt.compare(password, account.password_hash);
        if (!isValidPassword) {
            throw new AppError("Invalid email or password", 401);
        }

        const token = jwt.sign(
            { accountId: account.account_id, email: account.email, role: account.role },
            JWT_SECRET,
            { expiresIn: "7d" }
        );

        const userData = {
            account_id: account.account_id,
            first_name: account.first_name,
            last_name: account.last_name,
            email: account.email,
            role: account.role
        };

        res.status(200).json({
            success: true,
            data: { token, user: userData }
        });
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

export const createAccount = async (req, redirect, next) => {
    try {
        const account = await accountRepo.create({
            firstName,
            lastName,
            middleName: "",
            email,
            passwordHash: hashedPassword,
            role: role || "admin"
        });

        res.status(201).json({
            success: true,
            user: userData
        });
    } catch (error) {
        next(error);
    }
}