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
                    }
                }
            });

            const ownerSubscribersCount = await prisma.subscriptions.count({//Подписчики
                where: {
                    id_channel: video.id_owner
                }
            });

            return {
                ...video,
                ownerSubscribersCount
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
                }
            },
            skip: skip,
            take: Number(limit),
            orderBy: { load_date: 'desc' }
        })
            .then(videos => videos.map(video => ({
                ...video,
                owner_username: video.users.username,
                owner_channel_image: video.users.avatar_url
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
                }
            },
            skip: skip,
            take: Number(limit),
            orderBy: { load_date: 'desc' }
        })
            .then(videos => videos.map(video => ({
                ...video,
                owner_username: video.users.username,
                owner_channel_image: video.users.avatar_url
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
                    videos: true,
                    playlists: {
                        include: {
                            users: {
                                select: {
                                    username: true,
                                    avatar_url: true
                                }
                            }
                        }
                    }
                },
                skip: skip,
                take: Number(limit),
                orderBy: { date_added: 'desc' }
            });
            const videos = playlistVideos.map(video => ({
                ...video.videos,
                owner_username: video.playlists.users.username,
                owner_channel_image: video.playlists.users.avatar_url,
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

        const videos = history.map(item => ({
            ...item.videos,
            owner_username: item.users.username,
            owner_avatar: item.users.avatar_url,
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
    }
};