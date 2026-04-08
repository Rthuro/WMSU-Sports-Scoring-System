import * as departmentRepo from "../repositories/departmentRepo.js";
import { AppError } from "../middleware/errorHandler.js";

export const getDepartments = async (req, res, next) => {
    try {
        const departments = await departmentRepo.findAll();
        res.status(200).json({ success: true, data: departments });
    } catch (error) {
        next(error);
    }
};

export const getDepartmentById = async (req, res, next) => {
    try {
        const department = await departmentRepo.findById(req.params.id);
        if (!department) {
            throw new AppError("Department not found", 404);
        }
        res.status(200).json({ success: true, data: department });
    } catch (error) {
        next(error);
    }
};

export const createDepartment = async (req, res, next) => {
    try {
        const department = await departmentRepo.create(req.body);
        res.status(201).json({ success: true, data: department });
    } catch (error) {
        next(error);
    }
};

export const updateDepartment = async (req, res, next) => {
    try {
        const department = await departmentRepo.update(req.params.id, req.body);
        if (!department) {
            throw new AppError("Department not found", 404);
        }
        res.status(200).json({ success: true, data: department });
    } catch (error) {
        next(error);
    }
};

export const deleteDepartment = async (req, res, next) => {
    try {
        const department = await departmentRepo.softDelete(req.params.id);
        if (!department) {
            throw new AppError("Department not found", 404);
        }
        res.status(200).json({ success: true, data: department });
    } catch (error) {
        next(error);
    }
};