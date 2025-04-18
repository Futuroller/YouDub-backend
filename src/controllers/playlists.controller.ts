import { Request, Response } from "express";
import { playlistsService } from "../services/playlists.service";
import { videosService } from "../services/videos.service";

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
};