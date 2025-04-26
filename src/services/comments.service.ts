import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const commentsService = {
    async getCommentsForVideo(videoId: number, userId: number) {
        try {
            let comments = await prisma.comments.findMany({
                where: { id_video: videoId },
                select: {
                    id: true,
                    comment_date: true,
                    comment_text: true,
                    users: {
                        select: {
                            id: true,
                            username: true,
                            avatar_url: true,
                        },
                    },
                    user_comment_reaction: {
                        select: {
                            id_user: true,
                            id_reaction: true,
                            reactions: {
                                select: {
                                    type: true
                                }
                            }
                        }
                    }
                }
            });

            const result = comments.map(comment => {
                const likes = comment.user_comment_reaction.filter(r => r.reactions.type === 'like').length;
                const dislikes = comment.user_comment_reaction.filter(r => r.reactions.type === 'dislike').length;

                const currentUserReaction = comment.user_comment_reaction.find(r => r.id_user === userId)?.reactions.type || null;

                return {
                    id: comment.id,
                    comment_text: comment.comment_text,
                    comment_date: comment.comment_date,
                    user: comment.users,
                    likes,
                    dislikes,
                    currentUserReaction
                };
            });

            return result;

        } catch (error) {
            console.error('Ошибка при получении комментариев:', error);
            return null;
        }
    },
    async addComment(commentText: string, userId: number, videoId: number) {
        try {
            let comment = await prisma.comments.create({
                data: {
                    id_user: userId,
                    id_video: videoId,
                    comment_text: commentText,
                    comment_date: new Date(),
                }
            }).then(comment => ({ id_user, id_video, ...rest } = comment) => rest);

            return comment;
        } catch (error) {
            console.log(error);
            return null;
        }
    },
    async deleteComment(commentId: number) {
        try {
            let comment = await prisma.comments.delete({
                where: {
                    id: commentId,
                }
            });

            return comment;
        } catch (error) {
            console.log(error);
            throw new Error('Ошибка при удалении комментария: ' + error);
        }
    },
    async getCommentById(commentId: number) {
        try {
            let comment = await prisma.comments.findFirstOrThrow({
                where: {
                    id: commentId
                }
            });

            return comment;
        } catch (error) {
            console.log(error);
            return null;
        }
    },
    async createReaction(userId: number, commentId: number, reactionId: number) {
        try {
            const reaction = await prisma.user_comment_reaction.upsert({
                where: {
                    id_comment_id_user: {
                        id_comment: commentId,
                        id_user: userId
                    }
                },
                update: {
                    id_reaction: reactionId
                },
                create: {
                    id_comment: commentId,
                    id_user: userId,
                    id_reaction: reactionId,
                }
            });

            return reaction;
        } catch (error) {
            console.log(error);
            throw new Error('Ошибка оценки комментария: ' + error);
        }

    },

    async deleteReaction(userId: number, commentId: number) {
        try {
            const reaction = await prisma.user_comment_reaction.delete({
                where: {
                    id_comment_id_user: {
                        id_comment: commentId,
                        id_user: userId
                    }
                }
            });

            return null;
        } catch (error) {
            console.log(error);
            throw new Error('Ошибка удаления оценки комментария: ' + error);
        }
    },
};