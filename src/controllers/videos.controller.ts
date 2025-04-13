import { Request, Response } from "express";
import { videosService } from "../services/videos.service";
import { videos } from "@prisma/client";
import { tagsController } from "./tags.controller";
import { playlistsService } from "../services/playlists.service";

export const videosController = {//business
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
    getVideoByUrl: async (req: Request, res: Response) => {
        try {
            const url = req.params.url;

            if (url) {
                const video = await videosService.getVideoByUrl(url);

                if (video) {
                    res.status(200).json({ video });
                } else {
                    res.status(200).json({});
                }
            } else {
                res.status(500).json({ message: 'Ошибка при загрузке видео' });
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Ошибка при загрузке видео: ' + error });
        }
    },
    uploadVideo: async (req: Request, res: Response) => {
        try {
            let videoData = {
                name: req.body.name,
                description: req.body.description ? req.body.description : null,
                load_date: new Date(),
                views: 0,
                likes: 0,
                dislikes: 0,
                id_owner: +req.user.id,
                id_access: +req.body.id_access,
                id_category: +req.body.id_category,
                url: '',
                preview_url: ''
            };

            if (req.files) {
                const files = req.files as { [fildname: string]: Express.Multer.File[] };

                if (files.video?.[0]) {
                    videoData.url = files.video[0].filename;
                }
                if (files.preview?.[0]) {
                    videoData.preview_url = files.preview[0].filename;
                }
            }

            const video = await videosService.createVideo(videoData);
            let tagsIds;
            let playlistVideo;

            if (video) {
                if (req.body.tags) {
                    tagsIds = await tagsController.addTagsToVideo(req.body.tags, video.id)
                }
                if (req.body.id_playlist) {
                    playlistVideo = await playlistsService.addVideoToPlaylist(video.id, +req.body.id_playlist);
                }
            }
            res.status(200).json(video);

        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Ошибка при загрузке видео' + error });
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