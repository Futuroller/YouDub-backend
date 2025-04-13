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
exports.commentsController = void 0;
const comments_service_1 = require("../services/comments.service");
const videos_service_1 = require("../services/videos.service");
exports.commentsController = {
    getCommentsByVideoUrl: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const url = req.params.url;
            if (url) {
                const video = yield videos_service_1.videosService.getVideoByUrl(url);
                if (video) {
                    const comments = yield comments_service_1.commentsService.getCommentsForVideo(video.id);
                    res.status(200).json({ comments });
                }
                else {
                    res.status(200).json({});
                }
            }
            else {
                res.status(500).json({ message: 'Ошибка при загрузке комментариев' });
            }
        }
        catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Ошибка при загрузке комментариев: ' + error });
        }
    }),
};
