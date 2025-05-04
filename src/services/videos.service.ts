import { categories, favorite_categories, playlists, PrismaClient, videos } from "@prisma/client";
import { channelsService } from "./channels.service";
import Fuse from "fuse.js";

const prisma = new PrismaClient();

export const videosService = {
    async createVideo(videoData: any) {
        try {
            const video = await prisma.videos.create({
                data: videoData
            });

            return video;
        } catch (error) {
            console.log(error);
        } finally {
            await prisma.$disconnect();
        }
    },
    async getVideoByUrl(url: string, userId: number) {
        try {
            let video = await prisma.videos.findFirstOrThrow({
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

            const [views, likes, dislikes] = await Promise.all([
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

            const progressPercentObj = await prisma.history.findFirst({
                where: {
                    id_user: userId,
                    id_video: video.id
                },
                select: {
                    progress_percent: true,
                }
            });

            let progressPercent = progressPercentObj && 'progress_percent' in progressPercentObj ? progressPercentObj.progress_percent : 0

            const isFollowed = await channelsService.isFollowed(video.id_owner, userId);

            const ownerSubscribersCount = await prisma.subscriptions.count({//Подписчики
                where: {
                    id_channel: video.id_owner
                }
            });

            return {
                ...video,
                ownerSubscribersCount,
                views,
                likes,
                dislikes,
                progressPercent,
                isFollowed,
            };

        } catch (error) {
            return null;
        }
    },
    async getRecommendations(page: number, limit: number, categories: categories[], userId: number) {
        const skip = (page - 1) * limit;
        const categoryIds = categories.map(c => c.id);

        const videos = await prisma.videos.findMany({
            where: {
                id_category: {
                    in: categoryIds
                }
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
            .then(videos => videos.map(video => ({
                ...video,
                owner_username: video.users.username,
                owner_channel_image: video.users.avatar_url,
                views: video._count.history,
                progress_percent: video.history[0]?.progress_percent || 0
            })));

        const totalCount = videos.length;

        return { videos, totalCount };
    },
    async getVideosByQuery(page: number, limit: number, searchQuery: string) {
        const skip = (page - 1) * limit;

        const videos = await prisma.videos.findMany({
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
        }).then(videos => videos.map(video => ({
            ...video,
            owner_username: video.users.username,
            owner_channel_image: video.users.avatar_url,
            views: video._count.history,
        })));

        const totalCount = videos.length;

        return { videos, totalCount };
    },
    async getVideosFromChannel(page: number, limit: number, userId: number) {
        const skip = (page - 1) * limit;

        let myVideos = await prisma.videos.findMany({
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
            .then(videos => videos.map(video => ({
                ...video,
                owner_username: video.users.username,
                owner_channel_image: video.users.avatar_url,
                views: video._count.history
            })));

        const totalCount = myVideos.length;
        return { myVideos, totalCount };
    },
    async getVideosFromPlaylist(page: number, limit: number, playlist: playlists) {
        const skip = (page - 1) * limit;

        try {
            const playlistVideos = await prisma.playlist_videos.findMany({
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
            const videos = playlistVideos.map(video => ({
                ...video.videos,
                owner_username: video.playlists.users.username,
                owner_channel_image: video.playlists.users.avatar_url,
                views: video.videos._count.history,
            }));

            return videos;
        } catch (error) {
            throw new Error('Ошибка получения видео из плейлиста');
        }

    },
    async getHistoryVideos(page: number, limit: number, userId: number) {
        const skip = (page - 1) * limit;

        const history = await prisma.history.findMany({
            where: { id_user: userId },
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

        const videos = history.map(item => ({
            ...item.videos,
            owner_username: item.videos.users.username,
            owner_avatar: item.videos.users.avatar_url,
            views: item.videos._count.history,
            watched_at: item.watched_at
        }));

        const totalCount = await prisma.history.count({
            where: {
                id_user: userId
            }
        });

        return { videos, totalCount };
    },
    async getSubVideos(page: number, limit: number, userId: number) {
        const skip = (page - 1) * limit;

        const subVideos = await prisma.subscriptions.findMany({
            where: { id_subscriber: userId },
            select: {
                users_subscriptions_id_channelTousers: { // Достаем пользователей (каналы)
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

            return owner.videos.map(video => ({
                ...video,
                owner_username: owner.username,
                owner_channel_image: owner.avatar_url,
                views: owner._count.history,
            }));
        })

        const totalCount = await prisma.history.count({
            where: {
                id_user: userId
            }
        });

        return { videos, totalCount };
    },
    async cleanHistory(userId: number) {
        const deletedHistory = await prisma.history.deleteMany({
            where: {
                id_user: userId
            }
        });

        return deletedHistory;
    },
    async deleteHistoryVideo(videoId: number, userId: number) {
        const currentVideo = await prisma.history.findFirstOrThrow({
            where: {
                id_video: videoId,
                id_user: userId
            }
        });

        const deleteVideo = await prisma.history.delete({
            where: {
                id: currentVideo.id
            },
        });

        return deleteVideo;
    },
    async addVideoToHistory(userId: number, videoId: number) {
        const historyRecord = await prisma.history.upsert({
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
    },
    async addVideoToPlaylist(playlistId: number, videoId: number) {
        try {
            const result = await prisma.playlist_videos.create({
                data: {
                    id_playlist: playlistId,
                    id_video: videoId,
                    date_added: new Date(),
                }
            });

            return result;
        } catch (error) {
            throw new Error('Ошибка добавления видео в плейлист: ' + error)
        }
    },
    async setReaction(userId: number, videoId: number, reactionId: number | null) {
        const reaction = await prisma.history.update({
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
    },
    async updateViewProgress(userId: number, videoId: number, progressPercent: number) {
        const historyRecord = await prisma.history.update({
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
    },
};