import { Request, Response } from "express";
import { commentsService } from "../services/comments.service";
import { videosService } from "../services/videos.service";

export const commentsController = {//business
    getCommentsByVideoUrl: async (req: Request, res: Response) => {
        try {
            const url = req.params.url;

            if (url) {
                const video = await videosService.getVideoByUrl(url);

                if (video) {
                    const comments = await commentsService.getCommentsForVideo(video.id);

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
};