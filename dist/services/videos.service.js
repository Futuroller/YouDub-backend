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
const channels_service_1 = require("./channels.service");
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
    updateVideo(videoId, videoData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const video = yield prisma.videos.update({
                    where: {
                        id: videoId
                    },
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
    deleteVideo(videoId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const video = yield prisma.videos.delete({
                    where: {
                        id: videoId
                    },
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
    getVideoByUrl(url, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let video = yield prisma.videos.findFirstOrThrow({
                    where: { url: url },
                    include: {
                        users: {
                            select: {
                                username: true,
                                avatar_url: true,
                                tagname: true,
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
                const progressPercentObj = yield prisma.history.findFirst({
                    where: {
                        id_user: userId,
                        id_video: video.id
                    },
                    select: {
                        progress_percent: true,
                    }
                });
                let progressPercent = progressPercentObj && 'progress_percent' in progressPercentObj ? progressPercentObj.progress_percent : 0;
                const isFollowed = yield channels_service_1.channelsService.isFollowed(video.id_owner, userId);
                const ownerSubscribersCount = yield prisma.subscriptions.count({
                    where: {
                        id_channel: video.id_owner
                    }
                });
                return Object.assign(Object.assign({}, video), { ownerSubscribersCount,
                    views,
                    likes,
                    dislikes,
                    progressPercent,
                    isFollowed });
            }
            catch (error) {
                return null;
            }
        });
    },
    getRecommendations(page, limit, categories, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const skip = (page - 1) * limit;
            const categoryIds = categories.map(c => c.id);
            const videos = yield prisma.videos.findMany({
                where: {
                    id_category: {
                        in: categoryIds
                    },
                    id_access: 1
                },
                include: {
                    users: {
                        select: {
                            username: true,
                            avatar_url: true
                        }
                    },
                    history: {
                        where: {
                            id_user: userId
                        },
                        select: {
                            progress_percent: true
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
                .then(videos => videos.map(video => {
                var _a;
                return (Object.assign(Object.assign({}, video), { owner_username: video.users.username, owner_channel_image: video.users.avatar_url, views: video._count.history, progress_percent: ((_a = video.history[0]) === null || _a === void 0 ? void 0 : _a.progress_percent) || 0 }));
            }));
            const totalCount = videos.length;
            return { videos, totalCount };
        });
    },
    getVideosByQuery(page, limit, searchQuery) {
        return __awaiter(this, void 0, void 0, function* () {
            const skip = (page - 1) * limit;
            const videos = yield prisma.videos.findMany({
                where: {
                    OR: [
                        { name: { contains: searchQuery, mode: 'insensitive' } },
                        { description: { contains: searchQuery, mode: 'insensitive' } },
                        { users: { username: { contains: searchQuery, mode: 'insensitive' } } },
                        { video_tags: { some: { tags: { name: { contains: searchQuery, mode: 'insensitive' } } } } }
                    ]
                },
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
                    },
                    video_tags: {
                        select: {
                            tags: {
                                select: {
                                    name: true
                                }
                            }
                        }
                    }
                },
                skip: skip,
                take: Number(limit),
                orderBy: { load_date: 'desc' }
            }).then(videos => videos.map(video => (Object.assign(Object.assign({}, video), { owner_username: video.users.username, owner_channel_image: video.users.avatar_url, views: video._count.history }))));
            const totalCount = videos.length;
            return { videos, totalCount };
        });
    },
    getVideosFromChannel(page, limit, userId) {
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
                                users: {
                                    select: {
                                        username: true,
                                        avatar_url: true
                                    }
                                }
                            },
                        },
                    },
                    skip: skip,
                    take: Number(limit),
                    orderBy: { date_added: 'desc' }
                });
                const videos = playlistVideos.map(video => (Object.assign(Object.assign({}, video.videos), { owner_username: video.videos.users.username, owner_channel_image: video.videos.users.avatar_url, views: video.videos._count.history })));
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
                where: {
                    id_user: userId,
                    isHidden: false,
                },
                select: {
                    watched_at: true,
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
            const videos = history.map(item => (Object.assign(Object.assign({}, item.videos), { owner_username: item.videos.users.username, owner_avatar: item.videos.users.avatar_url, views: item.videos._count.history, watched_at: item.watched_at })));
            const totalCount = yield prisma.history.count({
                where: {
                    id_user: userId
                }
            });
            return { videos, totalCount };
        });
    },
    getSubVideos(page, limit, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const skip = (page - 1) * limit;
            const subVideos = yield prisma.subscriptions.findMany({
                where: { id_subscriber: userId },
                select: {
                    users_subscriptions_id_channelTousers: {
                        include: {
                            videos: true,
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
            });
            const videos = subVideos.flatMap(item => {
                const owner = item.users_subscriptions_id_channelTousers;
                return owner.videos.map(video => (Object.assign(Object.assign({}, video), { owner_username: owner.username, owner_channel_image: owner.avatar_url, views: owner._count.history })));
            });
            const totalCount = yield prisma.history.count({
                where: {
                    id_user: userId
                }
            });
            return { videos, totalCount };
        });
    },
    cleanHistory(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const deletedHistory = yield prisma.history.updateMany({
                where: {
                    id_user: userId
                },
                data: {
                    isHidden: true,
                }
            });
            return deletedHistory;
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
            const deleteVideo = yield prisma.history.update({
                where: {
                    id: currentVideo.id
                },
                data: {
                    isHidden: true,
                }
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
                    isHidden: false,
                },
                create: {
                    id_user: userId,
                    id_video: videoId,
                    progress_percent: 0,
                    watched_at: new Date(),
                    isHidden: false,
                }
            });
            return historyRecord;
        });
    },
    addVideoToPlaylist(playlistId, videoId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield prisma.playlist_videos.create({
                    data: {
                        id_playlist: playlistId,
                        id_video: videoId,
                        date_added: new Date(),
                    }
                });
                return result;
            }
            catch (error) {
                throw new Error('Ошибка добавления видео в плейлист: ' + error);
            }
        });
    },
    setReaction(userId, videoId, reactionId) {
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
    updateViewProgress(userId, videoId, progressPercent) {
        return __awaiter(this, void 0, void 0, function* () {
            const historyRecord = yield prisma.history.update({
                where: {
                    id_user_id_video: {
                        id_user: userId,
                        id_video: videoId
                    }
                },
                data: {
                    progress_percent: progressPercent
                }
            });
            return historyRecord;
        });
    },
};
