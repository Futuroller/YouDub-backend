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
exports.videosService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
exports.videosService = {
    getAllVideos(page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const skip = (page - 1) * limit;
            let videos = yield prisma.videos.findMany({
                skip: skip,
                take: Number(limit),
                orderBy: { load_date: 'desc' }
            });
            const totalCount = yield prisma.videos.count();
            return { videos, totalCount };
        });
    },
    getHistoryVideos(page, limit, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const skip = (page - 1) * limit;
            const history = yield prisma.history.findMany({
                where: { id_user: userId },
                include: {
                    videos: true,
                    users: {
                        select: {
                            username: true,
                            avatar_url: true
                        }
                    }
                },
                skip: skip,
                take: Number(limit),
                orderBy: { watched_at: 'desc' }
            });
            const videos = history.map(item => (Object.assign(Object.assign({}, item.videos), { owner_username: item.users.username })));
            const totalCount = yield prisma.history.count({
                where: {
                    id_user: userId
                }
            });
            return { videos, totalCount };
        });
    }
};
