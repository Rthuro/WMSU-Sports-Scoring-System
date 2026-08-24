import express from "express";
import { uploadImage, deleteImage } from "../controllers/uploadController.js";

const router = express.Router();

router.post("/", uploadImage);
router.delete("/delete/:public_id", deleteImage);

export default router;
