"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = __importDefault(require("crypto"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        let folder = 'uploads/avatars';
        switch (file.fieldname) {
            case 'header':
                folder = 'uploads/headers';
                break;
            case 'video':
                folder = 'uploads/videos';
                break;
            case 'preview':
                folder = 'uploads/previews';
                break;
        }
        cb(null, folder);
    },
    filename: (req, file, cb) => {
        const ext = path_1.default.extname(file.originalname);
        const uniqueName = crypto_1.default.randomBytes(16).toString('hex');
        cb(null, uniqueName + ext);
    }
});
const fileFilter = (req, file, cb) => {
    const imageTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    const videoTypes = ['video/mp4', 'video/webm'];
    const allowedTypes = [...imageTypes, ...videoTypes];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    }
    else {
        cb(new Error('Допускаются только изображения (JPG, PNG) и видео (MP4, WebM)'), false);
    }
};
const upload = (0, multer_1.default)({ storage, fileFilter }).fields([
    { name: 'avatar', maxCount: 1 },
    { name: 'header', maxCount: 1 },
    { name: 'video', maxCount: 1 },
    { name: 'preview', maxCount: 1 }
]);
exports.default = upload;
