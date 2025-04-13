import { PrismaClient, users } from "@prisma/client";
import crypto from 'crypto';

const prisma = new PrismaClient();

export const playlistsService = {
    async getAllPlaylists(user: users) {
        let playlists = await prisma.playlists.findMany({
            where: { id_user: user.id },
            include: {
                access_statuses: true,
                playlist_videos: true
            },
            orderBy: { name: 'desc' }
        })
            .then(playlists => playlists.map(playlist => ({
                ...playlist,
                access_status: playlist.access_statuses.name,
                videosCount: playlist.playlist_videos.length
            })));

        return playlists;
    },
    async getPlaylistByUrl(url: string) {
        try {
            let playlist = await prisma.playlists.findFirstOrThrow({
                where: { url: url },
            });

            return playlist;
        } catch (error) {
            return null;
        }
    },
    async createDefaultPlaylists(userId: number) {
        try {
            const watchLater = await prisma.playlists.create({
                data: {
                    name: 'Смотреть позже',
                    description: '',
                    url: crypto.randomUUID(),
                    id_user: userId,
                    id_access: 3,
                    creation_date: new Date()
                }
            });
            const likedVideos = await prisma.playlists.create({
                data: {
                    name: 'Понравившиеся',
                    description: '',
                    url: crypto.randomUUID(),
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
    async addVideoToPlaylist(videoId: number, playlistId: number) {
        try {
            const playlistVideo = await prisma.playlist_videos.create({
                data: {
                    id_video: videoId,
                    id_playlist: playlistId,
                    date_added: new Date()
                }
            });
            return playlistVideo;
        } catch (error) {
            throw new Error(`Ошибка при добавлении видео в плейлист: ${error}`);
        }
    },
};