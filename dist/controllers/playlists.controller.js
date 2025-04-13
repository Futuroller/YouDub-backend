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
exports.playlistsController = void 0;
const playlists_service_1 = require("../services/playlists.service");
const videos_service_1 = require("../services/videos.service");
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
    getPlaylistByUrl: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const url = req.params.url;
            const { page = 1, limit = 10 } = req.body;
            if (url) {
                const playlist = yield playlists_service_1.playlistsService.getPlaylistByUrl(url);
                if (playlist) {
                    const videos = yield videos_service_1.videosService.getVideosFromPlaylist(Number(page), Number(limit), playlist);
                    res.status(200).json({ videos, playlist });
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
};
