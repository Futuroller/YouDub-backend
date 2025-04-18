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
    createVideo(videoData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const video = yield prisma.videos.create({
                    data: videoData
                });
                return video;
            }
            catch (error) {
                console.log(error);
            }
            finally {
                yield prisma.$disconnect();
            }
        });
    },
    getVideoByUrl(url) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let video = yield prisma.videos.findFirstOrThrow({
                    where: { url: url },
                    include: {
                        users: {
                            select: {
                                username: true,
                                avatar_url: true,
                            },
                        },
                    }
                });
                const [views, likes, dislikes] = yield Promise.all([
                    prisma.history.count({
                        where: {
                            id_video: video.id,
                        }
                    }),
                    prisma.history.count({
                        where: {
                            id_video: video.id,
                            id_reaction: 1
                        }
                    }),
                    prisma.history.count({
                        where: {
                            id_video: video.id,
                            id_reaction: 2
                        }
                    })
                ]);
                const ownerSubscribersCount = yield prisma.subscriptions.count({
                    where: {
                        id_channel: video.id_owner
                    }
                });
                return Object.assign(Object.assign({}, video), { ownerSubscribersCount,
                    views,
                    likes,
                    dislikes });
            }
            catch (error) {
                return null;
            }
        });
    },
    getAllVideos(page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const skip = (page - 1) * limit;
            let videos = yield prisma.videos.findMany({
                include: {
                    users: {
                        select: {
                            username: true,
                            avatar_url: true
                        }
                    },
                    _count: {
                        select: {
                            history: true
                        }
                    }
                },
                skip: skip,
                take: Number(limit),
                orderBy: { load_date: 'desc' }
            })
                .then(videos => videos.map(video => (Object.assign(Object.assign({}, video), { owner_username: video.users.username, owner_channel_image: video.users.avatar_url, views: video._count.history }))));
            const totalCount = yield prisma.videos.count();
            return { videos, totalCount };
        });
    },
    getMyVideos(page, limit, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const skip = (page - 1) * limit;
            let myVideos = yield prisma.videos.findMany({
                where: { id_owner: userId },
                include: {
                    users: {
                        select: {
                            username: true,
                            avatar_url: true
                        }
                    },
                    _count: {
                        select: {
                            history: true
                        }
                    }
                },
                skip: skip,
                take: Number(limit),
                orderBy: { load_date: 'desc' }
            })
                .then(videos => videos.map(video => (Object.assign(Object.assign({}, video), { owner_username: video.users.username, owner_channel_image: video.users.avatar_url, views: video._count.history }))));
            const totalCount = myVideos.length;
            return { myVideos, totalCount };
        });
    },
    getVideosFromPlaylist(page, limit, playlist) {
        return __awaiter(this, void 0, void 0, function* () {
            const skip = (page - 1) * limit;
            try {
                const playlistVideos = yield prisma.playlist_videos.findMany({
                    where: { id_playlist: playlist.id },
                    include: {
                        videos: {
                            include: {
                                _count: {
                                    select: {
                                        history: true
                                    }
                                },
                            },
                        },
                        playlists: {
                            include: {
                                users: {
                                    select: {
                                        username: true,
                                        avatar_url: true
                                    }
                                }
                            }
                        },
                    },
                    skip: skip,
                    take: Number(limit),
                    orderBy: { date_added: 'desc' }
                });
                const videos = playlistVideos.map(video => (Object.assign(Object.assign({}, video.videos), { owner_username: video.playlists.users.username, owner_channel_image: video.playlists.users.avatar_url, views: video.videos._count.history })));
                return videos;
            }
            catch (error) {
                throw new Error('Ошибка получения видео из плейлиста');
            }
        });
    },
    getHistoryVideos(page, limit, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const skip = (page - 1) * limit;
            const history = yield prisma.history.findMany({
                where: { id_user: userId },
                include: {
                    videos: {
                        include: {
                            users: {
                                select: {
                                    username: true,
                                    avatar_url: true
                                }
                            },
                            _count: {
                                select: {
                                    history: true
                                }
                            }
                        }
                    }
                },
                skip: skip,
                take: Number(limit),
                orderBy: { watched_at: 'desc' }
            });
            const videos = history.map(item => (Object.assign(Object.assign({}, item.videos), { owner_username: item.videos.users.username, owner_avatar: item.videos.users.avatar_url, views: item.videos._count.history })));
            const totalCount = yield prisma.history.count({
                where: {
                    id_user: userId
                }
            });
            return { videos, totalCount };
        });
    },
    deleteHistoryVideo(videoId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentVideo = yield prisma.history.findFirstOrThrow({
                where: {
                    id_video: videoId,
                    id_user: userId
                }
            });
            const deleteVideo = yield prisma.history.delete({
                where: {
                    id: currentVideo.id
                },
            });
            return deleteVideo;
        });
    },
    addVideoToHistory(userId, videoId) {
        return __awaiter(this, void 0, void 0, function* () {
            const historyRecord = yield prisma.history.upsert({
                where: {
                    id_user_id_video: {
                        id_user: userId,
                        id_video: videoId,
                    },
                },
                update: {
                    watched_at: new Date(),
                },
                create: {
                    id_user: userId,
                    id_video: videoId,
                    progress_percent: 0,
                    watched_at: new Date(),
                }
            });
            return historyRecord;
        });
    },
    setReactionToVideo(userId, videoId, reactionId) {
        return __awaiter(this, void 0, void 0, function* () {
            const reaction = yield prisma.history.update({
                where: {
                    id_user_id_video: {
                        id_user: userId,
                        id_video: videoId
                    }
                },
                data: {
                    id_reaction: reactionId
                }
            });
            return reaction;
        });
    },
};
