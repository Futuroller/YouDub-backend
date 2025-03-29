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
    getMyVideos: async (req: Request, res: Response) => {
        try {
            const { page = 1, limit = 10 } = req.body;

            const data = await videosService.getMyVideos(Number(page), Number(limit), req.user.id);
            res.status(200).json(data);
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Ошибка при получении истории просмотра' + error });
        }
    },
    getHistoryVideos: async (req: Request, res: Response) => {
        try {
            const { page = 1, limit = 10 } = req.body;

            const data = await videosService.getHistoryVideos(Number(page), Number(limit), req.user.id);
            res.status(200).json(data);
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Ошибка при получении истории просмотра' + error });
        }
    },
    deleteHistoryVideo: async (req: Request, res: Response) => {
        try {
            const data = await videosService.deleteHistoryVideo(+req.params.id, req.user.id);
            res.status(200).json(data);
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Ошибка при удалении видео из истории' + error });
        }
    },
};