import { playlists, PrismaClient, videos } from "@prisma/client";

const prisma = new PrismaClient();

export const reactionService = {
    async isReacted(userId: number, videoId: number) {
        try {
            const reaction = await prisma.history.findUnique({
                where: {
                    id_user_id_video: {
                        id_user: userId,
                        id_video: videoId
                    }
                },
                select: {
                    id_reaction: true
                }
            });

            if (!reaction) return null;

            return reaction;
        } catch (error) {
            console.log(error);
        } finally {
            await prisma.$disconnect();
        }
    },
};