import { PrismaClient, users } from "@prisma/client";

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
    }

};