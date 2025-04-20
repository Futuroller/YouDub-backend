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
exports.videosController = void 0;
const videos_service_1 = require("../services/videos.service");
const tags_controller_1 = require("./tags.controller");
const playlists_service_1 = require("../services/playlists.service");
const reactions_service_1 = require("../services/reactions.service");
exports.videosController = {
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
    getVideoByUrl: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const url = req.params.url;
            if (url) {
                const video = yield videos_service_1.videosService.getVideoByUrl(url);
                if (video) {
                    const reaction = yield reactions_service_1.reactionService.isReacted(req.user.id, video.id);
                    res.status(200).json({ video, reaction });
                }
                else {
                    res.status(200).json({});
                }
            }
            else {
                res.status(500).json({ message: 'Ошибка при загрузке видео' });
            }
        }
        catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Ошибка при загрузке видео: ' + error });
        }
    }),
    uploadVideo: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        try {
            let videoData = {
                name: req.body.name,
                description: req.body.description ? req.body.description : null,
                load_date: new Date(),
                id_owner: +req.user.id,
                id_access: +req.body.id_access,
                id_category: +req.body.id_category,
                url: '',
                preview_url: ''
            };
            if (req.files) {
                const files = req.files;
                if ((_a = files.video) === null || _a === void 0 ? void 0 : _a[0]) {
                    videoData.url = files.video[0].filename;
                }
                if ((_b = files.preview) === null || _b === void 0 ? void 0 : _b[0]) {
                    videoData.preview_url = files.preview[0].filename;
                }
            }
            const video = yield videos_service_1.videosService.createVideo(videoData);
            let tagsIds;
            let playlistVideo;
            if (video) {
                if (req.body.tags) {
                    tagsIds = yield tags_controller_1.tagsController.addTagsToVideo(req.body.tags, video.id);
                }
                if (req.body.id_playlist) {
                    playlistVideo = yield playlists_service_1.playlistsService.addVideoToPlaylist(video.id, +req.body.id_playlist);
                }
            }
            res.status(200).json(video);
        }
        catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Ошибка при загрузке видео' + error });
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
    addVideoToHistory: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const userId = req.user.id;
            const url = req.params.url;
            const video = yield videos_service_1.videosService.getVideoByUrl(url);
            if (!video || !video.id)
                return;
            const data = yield videos_service_1.videosService.addVideoToHistory(userId, video.id);
            res.status(200).json(data);
        }
        catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Ошибка добавления видео в историю просмотра: ' + error });
        }
    }),
    setReactionToVideo: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const userId = req.user.id;
            const url = req.params.url;
            const video = yield videos_service_1.videosService.getVideoByUrl(url);
            const { reaction } = req.body;
            let reactionId = null;
            if (reaction === 'like')
                reactionId = 1;
            if (reaction === 'dislike')
                reactionId = 2;
            if (!video || !video.id)
                return;
            const data = yield videos_service_1.videosService.setReaction(userId, video.id, reactionId);
            res.status(200).json(data);
        }
        catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Ошибка оценки видео: ' + error });
        }
    }),
};
