import multer from "multer";
import cloudinary from "../config/cloudinary.js";

const storage = multer.memoryStorage();
const uploadCloud = multer({ storage });

export default uploadCloud;
