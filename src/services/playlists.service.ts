import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const playlistsService = {

    async getAllPlaylists() {
        let playlists = await prisma.playlists.findMany({
            orderBy: { name: 'desc' }
        });

        return playlists;
    }

};