import { tagsService } from "../services/tags.service";

export const tagsController = {
    async addTagsToVideo(tags: string[], videoId: number) {
        try {
            const parsedId = Number(videoId);
            if (!Array.isArray(tags) || isNaN(parsedId)) {
                throw new Error('Некорректные теги или videoId');
            }

            const tagIds = await tagsService.upsertTags(tags, videoId);

            return tagIds;
        } catch (error) {
            console.log(error);
        }
    }
};