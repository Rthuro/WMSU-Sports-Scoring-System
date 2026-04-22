import * as accountRepo from "../repositories/accountRepo.js";
import { AppError } from "../middleware/errorHandler.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import admin from "../config/firebase.js";

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

export const googleAuth = async (req, res, next) => {
    try {
        const { token } = req.body;

        if (!token) {
            throw new AppError("Firebase token is required", 400);
        }

        // Verify the Firebase ID token
        const decodedToken = await admin.auth().verifyIdToken(token);
        const { email, name, uid } = decodedToken;

        if (!email) {
            throw new AppError("Email not available from Google account", 400);
        }

        // Check if user already exists
        let account = await accountRepo.findByEmail(email);

        if (!account) {
            // Create a new account for Google users
            const nameParts = (name || "").split(" ");
            const firstName = nameParts[0] || "";
            const lastName = nameParts.slice(1).join(" ") || "";

            // Generate a random password hash for Google users (they won't use password login)
            const randomPassword = await bcrypt.hash(uid + Date.now(), 10);

            account = await accountRepo.create({
                firstName,
                lastName,
                middleName: "",
                email,
                passwordHash: randomPassword,
                role: "admin"
            });
        }

        const jwtToken = jwt.sign(
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
            data: { token: jwtToken, user: userData }
        });
    } catch (error) {
        if (error.code === "auth/id-token-expired") {
            return next(new AppError("Google token has expired", 401));
        }
        if (error.code === "auth/argument-error" || error.code === "auth/id-token-revoked") {
            return next(new AppError("Invalid Google token", 401));
        }
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