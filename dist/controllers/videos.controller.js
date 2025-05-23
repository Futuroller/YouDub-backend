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
const user_service_1 = require("../services/user.service");
const categories_service_1 = require("../services/categories.service");
const deleteFile_1 = require("../utils/deleteFile");
exports.videosController = {
    getRecommendations: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { page = 1, limit = 12 } = req.body;
            const userId = req.user.id;
            const categories = yield categories_service_1.categoriesService.getUserCategories(userId);
            const data = yield videos_service_1.videosService.getRecommendations(Number(page), Number(limit), categories, userId);
            res.status(200).json(data);
        }
        catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Ошибка при получении видео' + error });
        }
    }),
    getSearchVideos: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { page, limit } = req.body;
            const searchQuery = req.params.searchQuery;
            const data = yield videos_service_1.videosService.getVideosByQuery(Number(page), Number(limit), searchQuery);
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
                const video = yield videos_service_1.videosService.getVideoByUrl(url, req.user.id);
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
                    tagsIds = yield tags_controller_1.tagsController.addTagsToVideo(JSON.parse(req.body.tags), video.id);
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
    editVideo: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        try {
            const videoUrl = req.params.url;
            const video = yield videos_service_1.videosService.getVideoByUrl(videoUrl, req.user.id);
            if (!video) {
                res.status(404).json({ message: 'Видео не найдено' });
                return;
            }
            if (video.id_owner !== req.user.id) {
                res.status(403).json({ message: 'Нет доступа к редактированию этого видео' });
                return;
            }
            const updateData = {};
            if (req.body.name !== undefined)
                updateData.name = req.body.name;
            if (req.body.description !== undefined)
                updateData.description = req.body.description;
            if (req.body.id_access !== undefined)
                updateData.id_access = +req.body.id_access;
            if (req.body.id_category !== undefined)
                updateData.id_category = +req.body.id_category;
            if (req.files) {
                const files = req.files;
                if ((_a = files.preview) === null || _a === void 0 ? void 0 : _a[0]) {
                    updateData.preview_url = files.preview[0].filename;
                }
                if (video.preview_url && updateData.preview_url) {
                    (0, deleteFile_1.deleteFile)(`previews/${video.preview_url}`);
                }
            }
            if (Object.keys(updateData).length === 0) {
                res.status(400).json({ message: 'Нет изменений для обновления' });
                return;
            }
            const updatedVideo = yield videos_service_1.videosService.updateVideo(video.id, updateData);
            res.status(200).json(updatedVideo);
        }
        catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Ошибка при изменении видео' + error });
        }
    }),
    deleteVideo: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const videoUrl = req.params.url;
            const video = yield videos_service_1.videosService.getVideoByUrl(videoUrl, req.user.id);
            if (!video) {
                res.status(404).json({ message: 'Видео не найдено' });
                return;
            }
            const user = yield user_service_1.userService.findUser('id', req.user.id);
            if (!user || (user.id !== video.id_owner && user.id_role !== 2)) {
                res.status(403).json({ message: 'Недостаточно прав' });
                return;
            }
            const deletedVideo = yield videos_service_1.videosService.deleteVideo(video.id);
            res.status(200).json(deletedVideo);
        }
        catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Ошибка при изменении видео' + error });
        }
    }),
    getVideosFromChannel: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { page = 1, limit = 10 } = req.body;
            const tagname = req.params.tagname;
            const user = yield user_service_1.userService.findUser('tagname', tagname);
            if (!user) {
                res.status(500).json({ message: 'Пользователь не найден' });
                return;
            }
            const data = yield videos_service_1.videosService.getVideosFromChannel(Number(page), Number(limit), user.id);
            res.status(200).json(data);
        }
        catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Ошибка при получении видео с канала ' + error });
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
    cleanHistory: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const data = yield videos_service_1.videosService.cleanHistory(req.user.id);
            res.status(200).json({});
        }
        catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Ошибка удаления истории просмотра' + error });
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
            const video = yield videos_service_1.videosService.getVideoByUrl(url, userId);
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
            const video = yield videos_service_1.videosService.getVideoByUrl(url, userId);
            const { reaction } = req.body;
            let reactionId = null;
            if (reaction === 'like')
                reactionId = 1;
            if (reaction === 'dislike')
                reactionId = 2;
            if (!video || !video.id)
                return;
            const data = yield videos_service_1.videosService.setReaction(userId, video.id, reactionId);
            const likedPlaylist = yield playlists_service_1.playlistsService.getUserLikedPlaylist(userId);
            if (likedPlaylist != null) {
                if (reactionId === 1) {
                    yield playlists_service_1.playlistsService.addVideoToPlaylist(video.id, likedPlaylist.id);
                }
                else {
                    yield playlists_service_1.playlistsService.removeVideoFromPlaylist(video.id, likedPlaylist.id);
                }
            }
            else {
                throw new Error('Ошибка поиска плейлиста "Понравившиеся": ');
            }
            res.status(200).json(data);
        }
        catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Ошибка оценки видео: ' + error });
        }
    }),
    updateViewProgress: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const userId = req.user.id;
            const url = req.params.url;
            const video = yield videos_service_1.videosService.getVideoByUrl(url, userId);
            const { progress_percent } = req.body;
            if (!video || !video.id)
                return;
            const data = yield videos_service_1.videosService.updateViewProgress(userId, video.id, progress_percent);
            res.status(200).json(data);
        }
        catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Ошибка обновления прогресса просмотра: ' + error });
        }
    }),
    getSubVideos: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { page = 1, limit = 10 } = req.body;
            const data = yield videos_service_1.videosService.getSubVideos(Number(page), Number(limit), req.user.id);
            res.status(200).json(data);
        }
        catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Ошибка при получении истории просмотра' + error });
        }
    }),
};
