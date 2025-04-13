import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const tagsService = {
    async upsertTags(tags: string[], videoId: number) {
        const uniqueTags = [...new Set(tags.map(t => t.trim()
            .toLowerCase()).filter(t => t.length > 0))];
        const tagIds: number[] = [];

        for (const name of uniqueTags) {
            let tag = await prisma.tags.findUnique({ where: { name } });

            if (!tag) {
                tag = await prisma.tags.create({ data: { name } });
            }

            tagIds.push(tag.id);
        }

        for (const tagId of tagIds) {
            await prisma.video_tags.upsert({
                where: {
                    id_video_id_tag: {
                        id_video: videoId,
                        id_tag: tagId,
                    },
                },
                update: {},
                create: {
                    id_video: videoId,
                    id_tag: tagId,
                },
            });
        }

        return tagIds;
    }
};