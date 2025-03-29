import crypto from 'crypto';
import { Request } from 'express';
import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
    destination: (req: Request, file, cb) => {
        let folder = 'uploads/avatars';
        if (file.fieldname === 'header') {
            folder = 'uploads/headers';
        }
        cb(null, folder);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const uniqueName = crypto.randomBytes(16).toString('hex');
        cb(null, uniqueName + ext);
    }
});

const fileFilter = (req: Request, file: any, cb: any) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Допускаются только изображения (JPG, PNG)'), false);
    }
};

const upload = multer({ storage, fileFilter }).fields([
    { name: 'avatar', maxCount: 1 },
    { name: 'header', maxCount: 1 }
]);

export default upload;