import { Request, Response } from "express";
import { playlistsService } from "../services/playlists.service";

export const PlaylistsController = {//business
    getAllPlaylists: async (req: Request, res: Response) => {
        try {
            const playlists = await playlistsService.getAllPlaylists();

            res.status(200).json({ playlists });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Ошибка при получении плейлистов: ' + error });
        }
    }
};