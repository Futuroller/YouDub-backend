"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tagsService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
exports.tagsService = {
    upsertTags(tags, videoId) {
        return __awaiter(this, void 0, void 0, function* () {
            const uniqueTags = [...new Set(tags.map(t => t.trim()
                    .toLowerCase()).filter(t => t.length > 0))];
            const tagIds = [];
            for (const name of uniqueTags) {
                let tag = yield prisma.tags.findUnique({ where: { name } });
                if (!tag) {
                    tag = yield prisma.tags.create({ data: { name } });
                }
                tagIds.push(tag.id);
            }
            for (const tagId of tagIds) {
                yield prisma.video_tags.upsert({
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
        });
    }
};
