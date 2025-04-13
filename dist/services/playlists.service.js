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
exports.playlistsService = void 0;
const client_1 = require("@prisma/client");
const crypto_1 = __importDefault(require("crypto"));
const prisma = new client_1.PrismaClient();
exports.playlistsService = {
    getAllPlaylists(user) {
        return __awaiter(this, void 0, void 0, function* () {
            let playlists = yield prisma.playlists.findMany({
                where: { id_user: user.id },
                include: {
                    access_statuses: true,
                    playlist_videos: true
                },
                orderBy: { name: 'desc' }
            })
                .then(playlists => playlists.map(playlist => (Object.assign(Object.assign({}, playlist), { access_status: playlist.access_statuses.name, videosCount: playlist.playlist_videos.length }))));
            return playlists;
        });
    },
    getPlaylistByUrl(url) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let playlist = yield prisma.playlists.findFirstOrThrow({
                    where: { url: url },
                });
                return playlist;
            }
            catch (error) {
                return null;
            }
        });
    },
    createDefaultPlaylists(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const watchLater = yield prisma.playlists.create({
                    data: {
                        name: 'Смотреть позже',
                        description: '',
                        url: crypto_1.default.randomUUID(),
                        id_user: userId,
                        id_access: 3,
                        creation_date: new Date()
                    }
                });
                const likedVideos = yield prisma.playlists.create({
                    data: {
                        name: 'Понравившиеся',
                        description: '',
                        url: crypto_1.default.randomUUID(),
                        id_user: userId,
                        id_access: 3,
                        creation_date: new Date()
                    }
                });
                return { watchLater, likedVideos };
            }
            catch (error) {
                throw new Error(`Ошибка при создании базовых плейлистов: ${error}`);
            }
        });
    },
    addVideoToPlaylist(videoId, playlistId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const playlistVideo = yield prisma.playlist_videos.create({
                    data: {
                        id_video: videoId,
                        id_playlist: playlistId,
                        date_added: new Date()
                    }
                });
                return playlistVideo;
            }
            catch (error) {
                throw new Error(`Ошибка при добавлении видео в плейлист: ${error}`);
            }
        });
    },
};
