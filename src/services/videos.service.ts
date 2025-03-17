import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const videosService = {

    async getAllVideos(page: number, limit: number) {
        const skip = (page - 1) * limit;

        let videos = await prisma.videos.findMany({
            skip: skip,
            take: Number(limit),
            orderBy: { load_date: 'desc' }
        });

        const totalCount = await prisma.videos.count();

        return { videos, totalCount };
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
        }));

        const totalCount = await prisma.history.count({
            where: {
                id_user: userId
            }
        });

        return { videos, totalCount };
    }
};