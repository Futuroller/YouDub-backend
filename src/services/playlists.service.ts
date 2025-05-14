import { playlists, Prisma, PrismaClient, users } from "@prisma/client";
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
                videosCount: playlist.playlist_videos.length,
                isDefault: playlist.name === 'Смотреть позже' || playlist.name === 'Понравившиеся' ? true : false
            })));

        return playlists;
    },
    async getPlaylistByUrl(url: string) {
        try {
            let playlist = await prisma.playlists.findFirstOrThrow({
                where: { url: url },
            });

            return {
                ...playlist,
                isDefault: playlist.name === 'Смотреть позже' || playlist.name === 'Понравившиеся' ? true : false
            };
        } catch (error) {
            return null;
        }
    },
    async getUserLikedPlaylist(userId: number) {
        try {
            let likedPlaylist = await prisma.playlists.findFirstOrThrow({
                where: {
                    id_user: userId,
                    name: 'Понравившиеся'
                },
            });

            return likedPlaylist;
        } catch (error) {
            return null;
        }
    },
    async createPlaylist(data: Prisma.playlistsCreateInput) {
        try {
            const playlist = await prisma.playlists.create({
                data: data
            });

            return { playlist };
        } catch (error) {
            throw new Error(`Ошибка при создании плейлиста: ${error}`);
        }
    },
    async updatePlaylist(playlistId: number, playlistData: any) {
        try {
            const playlist = await prisma.playlists.update({
                where: {
                    id: playlistId
                },
                data: playlistData
            });

            return { playlist };
        } catch (error) {
            throw new Error(`Ошибка при изменении плейлиста: ${error}`);
        }
    },
    async deletePlaylist(playlistId: number) {
        try {
            const playlist = await prisma.playlists.delete({
                where: {
                    id: playlistId
                },
            });

            return { playlist };
        } catch (error) {
            throw new Error(`Ошибка при удалении плейлиста: ${error}`);
        }
    },
    async checkPlaylistName(name: string, userId: number) {
        try {
            const isUnique = await prisma.playlists.findFirst({
                where: {
                    id_user: userId,
                    name
                }
            }) ? false : true;//если нашёлся такой плейлист, то название не уникальное

            return isUnique;
        } catch (error) {
            throw new Error(`Ошибка при определении уникальности имени: ${error}`);
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
    async removeVideoFromPlaylist(videoId: number, playlistId: number) {
        try {
            const playlistVideo = await prisma.playlist_videos.deleteMany({
                where: {
                    id_playlist: playlistId,
                    id_video: videoId
                }
            });
            return playlistVideo;
        } catch (error) {
            throw new Error(`Ошибка при добавлении видео в плейлист: ${error}`);
        }
    },
};