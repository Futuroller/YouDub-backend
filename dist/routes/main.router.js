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
exports.mainRoute = (0, express_1.Router)();
exports.mainRoute.get('/', auth_middleware_1.authMiddleware, (req, res) => {
    res.status(200).json(req.user);
});
exports.mainRoute.post('/videos', videos_controller_1.VideosController.getAllVideos);
exports.mainRoute.post('/videos/my-channel', auth_middleware_1.authMiddleware, videos_controller_1.VideosController.getMyVideos);
exports.mainRoute.post('/history', auth_middleware_1.authMiddleware, videos_controller_1.VideosController.getHistoryVideos);
exports.mainRoute.delete('/history/:id', auth_middleware_1.authMiddleware, videos_controller_1.VideosController.deleteHistoryVideo);
exports.mainRoute.get('/playlists', auth_middleware_1.authMiddleware, playlists_controller_1.PlaylistsController.getAllPlaylists);
exports.mainRoute.post('/playlists/:url', auth_middleware_1.authMiddleware, playlists_controller_1.PlaylistsController.getPlaylistByUrl);
exports.mainRoute.get('/channels', auth_middleware_1.authMiddleware, channels_controller_1.ChannelsController.getChannels);
exports.mainRoute.patch('/user/configure', auth_middleware_1.authMiddleware, uploadFile_1.default, user_controller_1.UserController.updateUser);
exports.mainRoute.delete('/user/configure', auth_middleware_1.authMiddleware, user_controller_1.UserController.unsetUserField);
