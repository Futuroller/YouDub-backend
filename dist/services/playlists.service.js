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
exports.playlistsService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
exports.playlistsService = {
    getAllPlaylists(user) {
        return __awaiter(this, void 0, void 0, function* () {
            let playlists = yield prisma.playlists.findMany({
                where: { id_user: user.id },
                orderBy: { name: 'desc' }
            });
            return playlists;
        });
    },
    createDefaultPlaylists(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const watchLater = yield prisma.playlists.create({
                    data: {
                        name: 'Смотреть позже',
                        description: 'Важные видео',
                        url: '3e333123s312',
                        id_user: userId,
                        id_access: 3,
                        creation_date: new Date()
                    }
                });
                const likedVideos = yield prisma.playlists.create({
                    data: {
                        name: 'Понравившиеся',
                        description: '',
                        url: '3e3333212s3312',
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
};
