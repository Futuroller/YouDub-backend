import { Request } from "express";
import { PrismaClient, users } from "@prisma/client";

const prisma = new PrismaClient();

export const playlistsService = {

    async getAllPlaylists(user: users) {
        let playlists = await prisma.playlists.findMany({
            where: { id_user: user.id },
            orderBy: { name: 'desc' }
        });
        return playlists;
    },
    async createDefaultPlaylists(userId: number) {
        try {
            const watchLater = await prisma.playlists.create({
                data: {
                    name: 'Смотреть позже',
                    description: 'Важные видео',
                    url: '3e333123s312',
                    id_user: userId,
                    id_access: 3,
                    creation_date: new Date()
                }
            });
            const likedVideos = await prisma.playlists.create({
                data: {
                    name: 'Понравившиеся',
                    description: '',
                    url: '3e3333212s3312',
                    id_user: userId,
                    id_access: 3,
                    creation_date: new Date()
                }
            });
            return { watchLater, likedVideos };
        } catch (error) {
            throw new Error(`Ошибка при создании базовых плейлистов: ${error}`);
        }
    },
};