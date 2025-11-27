import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { Request } from "express";
import dotenv from "dotenv";
dotenv.config();
// Cloudinary Config
cloudinary.config({
  cloud_name: process.env.cloud_name ?? "",
  api_key: process.env.api_key ?? "",
  api_secret: process.env.api_secret ?? "",
});

// Cloudinary Storage (Images Only)
const storage = new CloudinaryStorage({
  cloudinary,
  params: (req: Request, file: Express.Multer.File) => {
    return {
      folder: "GraduationBro",
      resource_type: "image",
      public_id: `image-${Date.now()}`,
      transformation: [
        { width: 800, height: 800, crop: "limit" },
        { quality: "auto:good" }
      ]
    };
  },
});

// File Filter: Images Only
const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allowed = ["image/jpeg", "image/png", "image/gif"];

  if (allowed.includes(file.mimetype)) cb(null, true);
  else cb(new Error("Only JPG, PNG, and GIF images are allowed."));
};

// Multer Instance (Single Image Only)
export const uploadSingleImage = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB Max
    files: 2, // Only one file
  },
});
