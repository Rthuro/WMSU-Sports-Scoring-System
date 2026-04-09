import multer from "multer";
import { storage } from "../config/cloudinary.js";
import { AppError } from "../middleware/errorHandler.js";

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
}).single("image");

export const uploadImage = (req, res, next) => {
  upload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return next(new AppError(`Upload error: ${err.message}`, 400));
    } else if (err) {
      return next(new AppError(err.message, 500));
    }

    if (!req.file) {
      return next(new AppError("No file uploaded", 400));
    }

    res.status(200).json({
      status: "success",
      url: req.file.path,
      public_id: req.file.filename
    });
  });
};
