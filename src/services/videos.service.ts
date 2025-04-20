import { playlists, PrismaClient, videos } from "@prisma/client";

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
    async getVideoByUrl(url: string) {
        try {
            let video = await prisma.videos.findFirstOrThrow({
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
                dislikes
            };

        } catch (error) {
            return null;
        }
    },
    async getAllVideos(page: number, limit: number) {
        const skip = (page - 1) * limit;

        let videos = await prisma.videos.findMany({
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

        const totalCount = await prisma.videos.count();

        return { videos, totalCount };
    },
    async getMyVideos(page: number, limit: number, userId: number) {
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

        const videos = history.map(item => ({
            ...item.videos,
            owner_username: item.videos.users.username,
            owner_avatar: item.videos.users.avatar_url,
            views: item.videos._count.history
        }));

        const totalCount = await prisma.history.count({
            where: {
                id_user: userId
            }
        });

        return { videos, totalCount };
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
};