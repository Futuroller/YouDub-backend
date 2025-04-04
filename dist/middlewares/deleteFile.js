"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFile = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const deleteFile = (filePath) => {
    if (!filePath)
        return;
    const fullPath = path_1.default.join(__dirname, '..', '..', 'uploads', filePath);
    fs_1.default.unlink(fullPath, (err) => {
        console.log('deleted: ' + fullPath);
        if (err && err.code !== 'ENOENT') {
            console.log(`Ошибка удаления файла: ${err.message}`);
        }
    });
};
exports.deleteFile = deleteFile;
