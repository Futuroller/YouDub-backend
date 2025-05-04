import { Request, Response } from "express";
import { playlistsService } from "../services/playlists.service";
import { videosService } from "../services/videos.service";
import crypto from "crypto";
import { Prisma } from '@prisma/client';

export const playlistsController = {//business
    getAllPlaylists: async (req: Request, res: Response) => {
        try {
            if (req.user) {
                const playlists = await playlistsService.getAllPlaylists(req.user);

                res.status(200).json({ playlists });
            } else {
                res.status(500).json({ message: 'Ошибка получения пользовательских данных' });
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Ошибка при получении плейлистов: ' + error });
        }
    },
    createPlaylist: async (req: Request, res: Response) => {
        console.log('serrv-11')
        try {
            const data: Prisma.playlistsCreateInput = {
                name: req.body.name,
                description: req.body.description || null,
                url: crypto.randomUUID(),
                creation_date: new Date(),
                users: {
                    connect: { id: req.user.id }
                },
                access_statuses: {
                    connect: { id: req.body.id_access }
                }
            };

            const isNameUnique = await playlistsService.checkPlaylistName(req.body.name, req.user.id);
            console.log(isNameUnique)

            if (!isNameUnique) {
                res.status(206).json({ message: 'Плейлист с таким названием уже есть' });
                return;
            }

            const playlist = await playlistsService.createPlaylist(data);

            res.status(200).json({ playlist });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Ошибка при создании плейлиста: ' + error });
        }
    },
    getPlaylistByUrl: async (req: Request, res: Response) => {
        try {
            const url = req.params.url;
            const { page = 1, limit = 10 } = req.body;

            if (url) {
                const playlist = await playlistsService.getPlaylistByUrl(url);

                if (playlist) {
                    if (playlist.id_access === 2 && req.user.id !== playlist.id_user) {
                        res.status(401).json({ message: 'Это плейлист с ограниченным доступом' });
                    } else {
                        const videos = await videosService.getVideosFromPlaylist(Number(page), Number(limit), playlist)
                        res.status(200).json({ videos, playlist });
                    }
                } else {
                    res.status(200).json({});
                }
            } else {
                res.status(500).json({ message: 'Ошибка при получении плейлиста' });
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Ошибка при получении плейлистов: ' + error });
        }
    },
    getPlaylistDataByUrl: async (req: Request, res: Response) => {
        try {
            const url = req.params.url;

            if (url) {
                const playlist = await playlistsService.getPlaylistByUrl(url);

                if (playlist) {
                    if ((playlist.id_access === 2 || playlist.id_access === 3) && req.user.id !== playlist.id_user) {
                        res.status(401).json({ message: 'Это плейлист с ограниченным доступом' });
                    } else {
                        res.status(200).json({ playlist });
                    }
                } else {
                    res.status(200).json({});
                }
            } else {
                res.status(500).json({ message: 'Ошибка при получении плейлиста' });
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Ошибка при получении данных о плейлисте: ' + error });
        }
    },
    addVideoToPlaylist: async (req: Request, res: Response) => {
        try {
            const url = req.params.url;
            const videoId = req.body.videoId;

            if (url) {
                const playlist = await playlistsService.getPlaylistByUrl(url);

                if (playlist) {
                    const addedVideo = await videosService.addVideoToPlaylist(playlist.id, videoId)
                    res.status(200).json({ addedVideo });
                } else {
                    res.status(500).json({ message: 'Ошибка при получении плейлиста' });
                }
            } else {
                res.status(500).json({});
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Ошибка добавления видео в плейлист: ' + error });
        }
    },
    removeVideoFromPlaylist: async (req: Request, res: Response) => {
        try {
            const url = req.params.url;
            const videoId = req.body.videoId;

            if (url) {
                const playlist = await playlistsService.getPlaylistByUrl(url);

                if (playlist) {
                    const removedVideo = await playlistsService.removeVideoFromPlaylist(videoId, playlist.id)
                    console.log(removedVideo)
                    res.status(200).json({ removedVideo });
                } else {
                    res.status(500).json({ message: 'Ошибка при получении плейлиста' });
                }
            } else {
                res.status(500).json({});
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Ошибка удаления видео из плейлиста: ' + error });
        }
    },
};