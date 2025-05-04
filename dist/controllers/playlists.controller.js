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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.playlistsController = void 0;
const playlists_service_1 = require("../services/playlists.service");
const videos_service_1 = require("../services/videos.service");
const crypto_1 = __importDefault(require("crypto"));
exports.playlistsController = {
    getAllPlaylists: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (req.user) {
                const playlists = yield playlists_service_1.playlistsService.getAllPlaylists(req.user);
                res.status(200).json({ playlists });
            }
            else {
                res.status(500).json({ message: 'Ошибка получения пользовательских данных' });
            }
        }
        catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Ошибка при получении плейлистов: ' + error });
        }
    }),
    createPlaylist: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        console.log('serrv-11');
        try {
            const data = {
                name: req.body.name,
                description: req.body.description || null,
                url: crypto_1.default.randomUUID(),
                creation_date: new Date(),
                users: {
                    connect: { id: req.user.id }
                },
                access_statuses: {
                    connect: { id: req.body.id_access }
                }
            };
            const isNameUnique = yield playlists_service_1.playlistsService.checkPlaylistName(req.body.name, req.user.id);
            console.log(isNameUnique);
            if (!isNameUnique) {
                res.status(206).json({ message: 'Плейлист с таким названием уже есть' });
                return;
            }
            const playlist = yield playlists_service_1.playlistsService.createPlaylist(data);
            res.status(200).json({ playlist });
        }
        catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Ошибка при создании плейлиста: ' + error });
        }
    }),
    getPlaylistByUrl: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const url = req.params.url;
            const { page = 1, limit = 10 } = req.body;
            if (url) {
                const playlist = yield playlists_service_1.playlistsService.getPlaylistByUrl(url);
                if (playlist) {
                    if (playlist.id_access === 2 && req.user.id !== playlist.id_user) {
                        res.status(401).json({ message: 'Это плейлист с ограниченным доступом' });
                    }
                    else {
                        const videos = yield videos_service_1.videosService.getVideosFromPlaylist(Number(page), Number(limit), playlist);
                        res.status(200).json({ videos, playlist });
                    }
                }
                else {
                    res.status(200).json({});
                }
            }
            else {
                res.status(500).json({ message: 'Ошибка при получении плейлиста' });
            }
        }
        catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Ошибка при получении плейлистов: ' + error });
        }
    }),
    getPlaylistDataByUrl: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const url = req.params.url;
            if (url) {
                const playlist = yield playlists_service_1.playlistsService.getPlaylistByUrl(url);
                if (playlist) {
                    if ((playlist.id_access === 2 || playlist.id_access === 3) && req.user.id !== playlist.id_user) {
                        res.status(401).json({ message: 'Это плейлист с ограниченным доступом' });
                    }
                    else {
                        res.status(200).json({ playlist });
                    }
                }
                else {
                    res.status(200).json({});
                }
            }
            else {
                res.status(500).json({ message: 'Ошибка при получении плейлиста' });
            }
        }
        catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Ошибка при получении данных о плейлисте: ' + error });
        }
    }),
    addVideoToPlaylist: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const url = req.params.url;
            const videoId = req.body.videoId;
            if (url) {
                const playlist = yield playlists_service_1.playlistsService.getPlaylistByUrl(url);
                if (playlist) {
                    const addedVideo = yield videos_service_1.videosService.addVideoToPlaylist(playlist.id, videoId);
                    res.status(200).json({ addedVideo });
                }
                else {
                    res.status(500).json({ message: 'Ошибка при получении плейлиста' });
                }
            }
            else {
                res.status(500).json({});
            }
        }
        catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Ошибка добавления видео в плейлист: ' + error });
        }
    }),
    removeVideoFromPlaylist: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const url = req.params.url;
            const videoId = req.body.videoId;
            if (url) {
                const playlist = yield playlists_service_1.playlistsService.getPlaylistByUrl(url);
                if (playlist) {
                    const removedVideo = yield playlists_service_1.playlistsService.removeVideoFromPlaylist(videoId, playlist.id);
                    console.log(removedVideo);
                    res.status(200).json({ removedVideo });
                }
                else {
                    res.status(500).json({ message: 'Ошибка при получении плейлиста' });
                }
            }
            else {
                res.status(500).json({});
            }
        }
        catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Ошибка удаления видео из плейлиста: ' + error });
        }
    }),
};
