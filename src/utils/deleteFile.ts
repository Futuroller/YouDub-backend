import fs from 'fs';
import path from 'path';

export const deleteFile = (filePath: string) => {
    if (!filePath) return;

    const fullPath = path.join(__dirname, '..', '..', 'uploads', filePath);

    fs.unlink(fullPath, (err) => {
        console.log('deleted: ' + fullPath)
        if (err && err.code !== 'ENOENT') {
            console.log(`Ошибка удаления файла: ${err.message}`);
        }
    });
}