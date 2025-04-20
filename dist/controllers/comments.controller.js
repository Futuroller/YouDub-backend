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
            const userId = req.user.id;
            if (url) {
                const video = yield videos_service_1.videosService.getVideoByUrl(url);
                if (video) {
                    const comments = yield comments_service_1.commentsService.getCommentsForVideo(video.id, userId);
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
    addComment: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const url = req.params.url;
            const commentText = req.body.comment;
            const userId = req.user.id;
            if (url) {
                const video = yield videos_service_1.videosService.getVideoByUrl(url);
                if (video) {
                    const comment = yield comments_service_1.commentsService.addComment(commentText, userId, video.id);
                    res.status(200).json({ comment });
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
    setReactionToComment: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const userId = req.user.id;
            const commentId = +req.params.id;
            const comment = yield comments_service_1.commentsService.getCommentById(commentId);
            const { reaction } = req.body;
            let reactionId = null;
            if (reaction === 'like')
                reactionId = 1;
            if (reaction === 'dislike')
                reactionId = 2;
            if (!comment || !comment.id)
                return;
            if (reactionId) {
                const data = yield comments_service_1.commentsService.createReaction(userId, comment.id, reactionId);
                res.status(200).json(data);
            }
            else {
                const data = yield comments_service_1.commentsService.deleteReaction(userId, comment.id);
                res.status(200).json(data);
            }
        }
        catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Ошибка оценки комментария: ' + error });
        }
    }),
};
