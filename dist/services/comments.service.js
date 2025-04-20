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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentsService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
exports.commentsService = {
    getCommentsForVideo(videoId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let comments = yield prisma.comments.findMany({
                    where: { id_video: videoId },
                    select: {
                        id: true,
                        comment_date: true,
                        comment_text: true,
                        users: {
                            select: {
                                username: true,
                                avatar_url: true,
                            },
                        },
                        user_comment_reaction: {
                            select: {
                                id_user: true,
                                id_reaction: true,
                                reactions: {
                                    select: {
                                        type: true
                                    }
                                }
                            }
                        }
                    }
                });
                const result = comments.map(comment => {
                    var _a;
                    const likes = comment.user_comment_reaction.filter(r => r.reactions.type === 'like').length;
                    const dislikes = comment.user_comment_reaction.filter(r => r.reactions.type === 'dislike').length;
                    const currentUserReaction = ((_a = comment.user_comment_reaction.find(r => r.id_user === userId)) === null || _a === void 0 ? void 0 : _a.reactions.type) || null;
                    return {
                        id: comment.id,
                        comment_text: comment.comment_text,
                        comment_date: comment.comment_date,
                        user: comment.users,
                        likes,
                        dislikes,
                        currentUserReaction
                    };
                });
                return result;
            }
            catch (error) {
                console.error('Ошибка при получении комментариев:', error);
                return null;
            }
        });
    },
    addComment(commentText, userId, videoId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let comment = yield prisma.comments.create({
                    data: {
                        id_user: userId,
                        id_video: videoId,
                        comment_text: commentText,
                        comment_date: new Date(),
                    }
                }).then(comment => (_a = comment) => {
                    var { id_user, id_video } = _a, rest = __rest(_a, ["id_user", "id_video"]);
                    return rest;
                });
                return comment;
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    },
    getCommentById(commentId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let comment = yield prisma.comments.findFirstOrThrow({
                    where: {
                        id: commentId
                    }
                });
                return comment;
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    },
    createReaction(userId, commentId, reactionId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const reaction = yield prisma.user_comment_reaction.upsert({
                    where: {
                        id_comment_id_user: {
                            id_comment: commentId,
                            id_user: userId
                        }
                    },
                    update: {
                        id_reaction: reactionId
                    },
                    create: {
                        id_comment: commentId,
                        id_user: userId,
                        id_reaction: reactionId,
                    }
                });
                return reaction;
            }
            catch (error) {
                console.log(error);
                throw new Error('Ошибка оценки комментария: ' + error);
            }
        });
    },
    deleteReaction(userId, commentId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const reaction = yield prisma.user_comment_reaction.delete({
                    where: {
                        id_comment_id_user: {
                            id_comment: commentId,
                            id_user: userId
                        }
                    }
                });
                return null;
            }
            catch (error) {
                console.log(error);
                throw new Error('Ошибка удаления оценки комментария: ' + error);
            }
        });
    },
};
