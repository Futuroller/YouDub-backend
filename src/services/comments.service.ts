import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const commentsService = {
    async getCommentsForVideo(videoId: number) {
        try {
            let comments = await prisma.comments.findMany({
                where: { id_video: videoId },
                include: {
                    users: {
                        select: {
                            username: true,
                            avatar_url: true,
                        },
                    }
                }
            }).then(comments => comments.map(({ id_user, id_video, ...rest }) => rest));

            return comments;
        } catch (error) {
            return null;
        }
    }
};