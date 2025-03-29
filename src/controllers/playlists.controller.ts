import { Request, Response } from "express";
import { playlistsService } from "../services/playlists.service";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const PlaylistsController = {//business
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
};