import { Request, Response, Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { videosController } from "../controllers/videos.controller";
import { playlistsController } from "../controllers/playlists.controller";
import { channelsController } from "../controllers/channels.controller";
import upload from "../middlewares/uploadFile";
import { userController } from "../controllers/user.controller";
import { categoriesController } from "../controllers/categories.controller";
import { commentsController } from "../controllers/comments.controller";
export const mainRoute = Router();

mainRoute.get('/', authMiddleware, (req: Request, res: Response) => {
    res.status(200).json(req.user);
});

mainRoute.post('/videos', videosController.getAllVideos);
mainRoute.post('/videos/my-channel', authMiddleware, videosController.getMyVideos);
mainRoute.post('/videos/upload', authMiddleware, upload, videosController.uploadVideo);
mainRoute.get('/videos/:url', authMiddleware, videosController.getVideoByUrl);
mainRoute.patch('/videos/reaction/:url', authMiddleware, videosController.setReactionToVideo);
mainRoute.get('/comments/:url', authMiddleware, commentsController.getCommentsByVideoUrl);
mainRoute.post('/history', authMiddleware, videosController.getHistoryVideos);
mainRoute.delete('/history/:id', authMiddleware, videosController.deleteHistoryVideo);
mainRoute.post('/history/:url', authMiddleware, videosController.addVideoToHistory);
mainRoute.get('/playlists', authMiddleware, playlistsController.getAllPlaylists);
mainRoute.post('/playlists/:url', authMiddleware, playlistsController.getPlaylistByUrl);
mainRoute.get('/playlist/:url', authMiddleware, playlistsController.getPlaylistDataByUrl);
mainRoute.get('/channels', authMiddleware, channelsController.getChannels);
mainRoute.patch('/user/configure', authMiddleware, upload, userController.updateUser);
mainRoute.delete('/user/configure', authMiddleware, userController.unsetUserField);
mainRoute.get('/categories', authMiddleware, categoriesController.getAllCategories);