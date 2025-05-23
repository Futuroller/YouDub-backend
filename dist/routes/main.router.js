"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mainRoute = void 0;
const express_1 = require("express");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const videos_controller_1 = require("../controllers/videos.controller");
const playlists_controller_1 = require("../controllers/playlists.controller");
const channels_controller_1 = require("../controllers/channels.controller");
const uploadFile_1 = __importDefault(require("../middlewares/uploadFile"));
const user_controller_1 = require("../controllers/user.controller");
const categories_controller_1 = require("../controllers/categories.controller");
const comments_controller_1 = require("../controllers/comments.controller");
exports.mainRoute = (0, express_1.Router)();
exports.mainRoute.get('/', auth_middleware_1.authMiddleware, (req, res) => {
    res.status(200).json(req.user);
});
exports.mainRoute.post('/videos', auth_middleware_1.authMiddleware, videos_controller_1.videosController.getRecommendations);
exports.mainRoute.post('/videos/channel/:tagname', auth_middleware_1.authMiddleware, videos_controller_1.videosController.getVideosFromChannel);
exports.mainRoute.post('/videos/channels', auth_middleware_1.authMiddleware, videos_controller_1.videosController.getSubVideos);
exports.mainRoute.post('/videos/upload', auth_middleware_1.authMiddleware, uploadFile_1.default, videos_controller_1.videosController.uploadVideo);
exports.mainRoute.get('/videos/:url', auth_middleware_1.authMiddleware, videos_controller_1.videosController.getVideoByUrl);
exports.mainRoute.delete('/videos/:url', auth_middleware_1.authMiddleware, videos_controller_1.videosController.deleteVideo);
exports.mainRoute.post('/videos/search/:searchQuery', auth_middleware_1.authMiddleware, videos_controller_1.videosController.getSearchVideos);
exports.mainRoute.patch('/videos/edit/:url', auth_middleware_1.authMiddleware, uploadFile_1.default, videos_controller_1.videosController.editVideo);
exports.mainRoute.patch('/videos/reaction/:url', auth_middleware_1.authMiddleware, videos_controller_1.videosController.setReactionToVideo);
exports.mainRoute.get('/comments/:url', auth_middleware_1.authMiddleware, comments_controller_1.commentsController.getCommentsByVideoUrl);
exports.mainRoute.post('/comments/:url', auth_middleware_1.authMiddleware, comments_controller_1.commentsController.addComment);
exports.mainRoute.delete('/comments/:id', auth_middleware_1.authMiddleware, comments_controller_1.commentsController.removeComment);
exports.mainRoute.patch('/comments/reaction/:id', auth_middleware_1.authMiddleware, comments_controller_1.commentsController.setReactionToComment);
exports.mainRoute.post('/history', auth_middleware_1.authMiddleware, videos_controller_1.videosController.getHistoryVideos);
exports.mainRoute.delete('/history', auth_middleware_1.authMiddleware, videos_controller_1.videosController.cleanHistory);
exports.mainRoute.delete('/history/:id', auth_middleware_1.authMiddleware, videos_controller_1.videosController.deleteHistoryVideo);
exports.mainRoute.post('/history/:url', auth_middleware_1.authMiddleware, videos_controller_1.videosController.addVideoToHistory);
exports.mainRoute.patch('/history/video/:url', auth_middleware_1.authMiddleware, videos_controller_1.videosController.updateViewProgress);
exports.mainRoute.get('/playlists', auth_middleware_1.authMiddleware, playlists_controller_1.playlistsController.getAllPlaylists);
exports.mainRoute.post('/playlists/:url', auth_middleware_1.authMiddleware, playlists_controller_1.playlistsController.getPlaylistByUrl);
exports.mainRoute.post('/playlist', auth_middleware_1.authMiddleware, playlists_controller_1.playlistsController.createPlaylist);
exports.mainRoute.get('/playlist/:url', auth_middleware_1.authMiddleware, playlists_controller_1.playlistsController.getPlaylistDataByUrl);
exports.mainRoute.delete('/playlist/:url', auth_middleware_1.authMiddleware, playlists_controller_1.playlistsController.removePlaylist);
exports.mainRoute.patch('/playlist/edit/:url', auth_middleware_1.authMiddleware, playlists_controller_1.playlistsController.editPlaylist);
exports.mainRoute.patch('/playlists/video/:url', auth_middleware_1.authMiddleware, playlists_controller_1.playlistsController.addVideoToPlaylist);
exports.mainRoute.delete('/playlists/video/:url', auth_middleware_1.authMiddleware, playlists_controller_1.playlistsController.removeVideoFromPlaylist);
exports.mainRoute.get('/channels', auth_middleware_1.authMiddleware, channels_controller_1.channelsController.getChannels);
exports.mainRoute.get('/channels/:tagname', auth_middleware_1.authMiddleware, channels_controller_1.channelsController.getChannelByTagname);
exports.mainRoute.post('/channels/subscription/:tagname', auth_middleware_1.authMiddleware, channels_controller_1.channelsController.subscribe);
exports.mainRoute.delete('/channels/subscription/:tagname', auth_middleware_1.authMiddleware, channels_controller_1.channelsController.unsubscribe);
exports.mainRoute.patch('/user/configure', auth_middleware_1.authMiddleware, uploadFile_1.default, user_controller_1.userController.updateUser);
exports.mainRoute.delete('/user/configure', auth_middleware_1.authMiddleware, user_controller_1.userController.unsetUserField);
exports.mainRoute.patch('/user/ban/:tagname', auth_middleware_1.authMiddleware, user_controller_1.userController.banUser);
exports.mainRoute.patch('/user/unban/:tagname', auth_middleware_1.authMiddleware, user_controller_1.userController.unbanUser);
exports.mainRoute.get('/categories', categories_controller_1.categoriesController.getAllCategories);
exports.mainRoute.get('/user/categories', auth_middleware_1.authMiddleware, categories_controller_1.categoriesController.getUsersCategories);
