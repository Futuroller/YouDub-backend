import { Request, Response } from "express";
import { videosService } from "../services/videos.service";
import { videos } from "@prisma/client";
import { tagsController } from "./tags.controller";
import { playlistsService } from "../services/playlists.service";
import { reactionService } from "../services/reactions.service";
import { userService } from "../services/user.service";
import { categoriesService } from "../services/categories.service";

export const videosController = {//business
    getRecommendations: async (req: Request, res: Response) => {
        try {
            const { page = 1, limit = 12 } = req.body;
            const userId = req.user.id;

            const categories = await categoriesService.getUsersCategories(userId);
            const data = await videosService.getRecommendations(Number(page), Number(limit), categories);

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
                const video = await videosService.getVideoByUrl(url, req.user.id);
                if (video) {
                    const reaction = await reactionService.isReacted(req.user.id, video.id)
                    res.status(200).json({ video, reaction });
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
                    tagsIds = await tagsController.addTagsToVideo(JSON.parse(req.body.tags), video.id)
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
    getVideosFromChannel: async (req: Request, res: Response) => {
        try {
            const { page = 1, limit = 10 } = req.body;
            const tagname = req.params.tagname;
            const user = await userService.findUser('tagname', tagname);

            if (!user) {
                res.status(500).json({ message: 'Пользователь не найден' });
                return;
            }

            const data = await videosService.getVideosFromChannel(Number(page), Number(limit), user.id);
            res.status(200).json(data);
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Ошибка при получении видео с канала ' + error });
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
    addVideoToHistory: async (req: Request, res: Response) => {
        try {
            const userId = req.user.id;
            const url = req.params.url;
            const video = await videosService.getVideoByUrl(url, userId);
            if (!video || !video.id) return;
            const data = await videosService.addVideoToHistory(userId, video.id);
            res.status(200).json(data);
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Ошибка добавления видео в историю просмотра: ' + error });
        }
    },
    setReactionToVideo: async (req: Request, res: Response) => {
        try {
            const userId = req.user.id;
            const url = req.params.url;
            const video = await videosService.getVideoByUrl(url, userId);

            const { reaction } = req.body;
            let reactionId = null;
            if (reaction === 'like') reactionId = 1;
            if (reaction === 'dislike') reactionId = 2;

            if (!video || !video.id) return;
            const data = await videosService.setReaction(userId, video.id, reactionId);
            const likedPlaylist = await playlistsService.getUserLikedPlaylist(userId);
            if (likedPlaylist != null) {
                if (reactionId === 1) {
                    await playlistsService.addVideoToPlaylist(video.id, likedPlaylist.id);
                } else {
                    await playlistsService.removeVideoFromPlaylist(video.id, likedPlaylist.id);
                }
            } else {
                throw new Error('Ошибка поиска плейлиста "Понравившиеся": ');
            }
            res.status(200).json(data);
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Ошибка оценки видео: ' + error });
        }
    },
    getSubVideos: async (req: Request, res: Response) => {
        try {
            const { page = 1, limit = 10 } = req.body;

            const data = await videosService.getSubVideos(Number(page), Number(limit), req.user.id);
            res.status(200).json(data);
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Ошибка при получении истории просмотра' + error });
        }
    },
};