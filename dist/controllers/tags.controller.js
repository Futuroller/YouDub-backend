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
exports.tagsController = void 0;
const tags_service_1 = require("../services/tags.service");
exports.tagsController = {
    addTagsToVideo(tags, videoId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const parsedId = Number(videoId);
                if (!Array.isArray(tags) || isNaN(parsedId)) {
                    throw new Error('Некорректные теги или videoId');
                }
                const tagIds = yield tags_service_1.tagsService.upsertTags(tags, videoId);
                return tagIds;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
};
