import crypto from 'crypto';
import { Request } from 'express';
import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
    destination: (req: Request, file, cb) => {
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
        const ext = path.extname(file.originalname);
        const uniqueName = crypto.randomBytes(16).toString('hex');
        cb(null, uniqueName + ext);
    }
});

const fileFilter = (req: Request, file: any, cb: any) => {
    const imageTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    const videoTypes = ['video/mp4', 'video/webm'];

    const allowedTypes = [...imageTypes, ...videoTypes];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Допускаются только изображения (JPG, PNG) и видео (MP4, WebM)'), false);
    }
};

const upload = multer({ storage, fileFilter }).fields([
    { name: 'avatar', maxCount: 1 },
    { name: 'header', maxCount: 1 },
    { name: 'video', maxCount: 1 },
    { name: 'preview', maxCount: 1 }
]);

export default upload;