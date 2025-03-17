"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mainRoute = void 0;
const express_1 = require("express");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const videos_controller_1 = require("../controllers/videos.controller");
const playlists_controller_1 = require("../controllers/playlists.controller");
exports.mainRoute = (0, express_1.Router)();
exports.mainRoute.get('/', auth_middleware_1.authMiddleware, (req, res) => {
    res.status(200).json(req.user);
});
exports.mainRoute.post('/videos', videos_controller_1.VideosController.getAllVideos);
exports.mainRoute.get('/playlists', playlists_controller_1.PlaylistsController.getAllPlaylists);
exports.mainRoute.post('/history', videos_controller_1.VideosController.getHistoryVideos);
