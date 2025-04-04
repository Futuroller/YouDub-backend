"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideosController = void 0;
const videos_service_1 = require("../services/videos.service");
exports.VideosController = {
    getAllVideos: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { page = 1, limit = 10 } = req.body;
            const data = yield videos_service_1.videosService.getAllVideos(Number(page), Number(limit));
            res.status(200).json(data);
        }
        catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Ошибка при получении видео' + error });
        }
    }),
    getMyVideos: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { page = 1, limit = 10 } = req.body;
            const data = yield videos_service_1.videosService.getMyVideos(Number(page), Number(limit), req.user.id);
            res.status(200).json(data);
        }
        catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Ошибка при получении истории просмотра' + error });
        }
    }),
    getHistoryVideos: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { page = 1, limit = 10 } = req.body;
            const data = yield videos_service_1.videosService.getHistoryVideos(Number(page), Number(limit), req.user.id);
            res.status(200).json(data);
        }
        catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Ошибка при получении истории просмотра' + error });
        }
    }),
    deleteHistoryVideo: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const data = yield videos_service_1.videosService.deleteHistoryVideo(+req.params.id, req.user.id);
            res.status(200).json(data);
        }
        catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Ошибка при удалении видео из истории' + error });
        }
    }),
};
