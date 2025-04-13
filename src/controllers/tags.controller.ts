import { tagsService } from "../services/tags.service";

export const tagsController = {//business
    async addTagsToVideo(tags: string[], videoId: number) {
        try {
            if (!Array.isArray(tags) || isNaN(videoId)) {
                throw new Error('Некорректные теги или videoId');
            }

            const tagIds = await tagsService.upsertTags(tags, videoId);

            return tagIds;
        } catch (error) {
            console.log(error);
        }
    }
};