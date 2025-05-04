import { Request, Response } from "express";
import { commentsService } from "../services/comments.service";
import { videosService } from "../services/videos.service";

export const commentsController = {//business
    getCommentsByVideoUrl: async (req: Request, res: Response) => {
        try {
            const url = req.params.url;
            const userId = req.user.id;

            if (url) {
                const video = await videosService.getVideoByUrl(url, userId);

                if (video) {
                    const comments = await commentsService.getCommentsForVideo(video.id, userId);

                    res.status(200).json({ comments });
                } else {
                    res.status(200).json({});
                }
            } else {
                res.status(500).json({ message: 'Ошибка при загрузке комментариев' });
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Ошибка при загрузке комментариев: ' + error });
        }
    },
    addComment: async (req: Request, res: Response) => {
        try {
            const url = req.params.url;
            const commentText = req.body.comment;
            const userId = req.user.id;

            if (url) {
                const video = await videosService.getVideoByUrl(url, userId);

                if (video) {
                    const comment = await commentsService.addComment(commentText, userId, video.id);

                    res.status(200).json({ comment });
                } else {
                    res.status(200).json({});
                }
            } else {
                res.status(500).json({ message: 'Ошибка при загрузке комментариев' });
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Ошибка при загрузке комментариев: ' + error });
        }
    },
    removeComment: async (req: Request, res: Response) => {
        try {
            const id = +req.params.id;

            if (id) {
                const removedComment = await commentsService.deleteComment(id);
                res.status(200).json({ removedComment });
            } else {
                res.status(500).json({ message: 'Ошибка при удалении комментария: не передан id' });
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Ошибка при удалении комментария: ' + error });
        }
    },
    setReactionToComment: async (req: Request, res: Response) => {//не сделано
        try {
            const userId = req.user.id;
            const commentId = +req.params.id;
            const comment = await commentsService.getCommentById(commentId);

            const { reaction } = req.body;
            let reactionId = null;
            if (reaction === 'like') reactionId = 1;
            if (reaction === 'dislike') reactionId = 2;

            if (!comment || !comment.id) return;

            if (reactionId) {
                const data = await commentsService.createReaction(userId, comment.id, reactionId);
                res.status(200).json(data);
            } else {
                const data = await commentsService.deleteReaction(userId, comment.id);
                res.status(200).json(data);
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Ошибка оценки комментария: ' + error });
        }
    },
};