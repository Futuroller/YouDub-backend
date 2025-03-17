import { Request, Response } from "express";
import { videosService } from "../services/videos.service";

export const VideosController = {//business
    getAllVideos: async (req: Request, res: Response) => {
        try {
            const { page = 1, limit = 10 } = req.body;

            const data = await videosService.getAllVideos(Number(page), Number(limit));

            res.status(200).json(data);
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Ошибка при получении видео' + error });
        }
    },
    getHistoryVideos: async (req: Request, res: Response) => {
        try {
            const { page = 1, limit = 10, userId } = req.body;

            const data = await videosService.getHistoryVideos(Number(page), Number(limit), userId);
            res.status(200).json(data);
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Ошибка при получении истории просмотра' + error });
        }
    },
};