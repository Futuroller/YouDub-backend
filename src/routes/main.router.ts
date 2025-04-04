import { Request, Response, Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { VideosController } from "../controllers/videos.controller";
import { PlaylistsController } from "../controllers/playlists.controller";
import { ChannelsController } from "../controllers/channels.controller";
import upload from "../middlewares/uploadFile";
import { UserController } from "../controllers/user.controller";
export const mainRoute = Router();

mainRoute.get('/', authMiddleware, (req: Request, res: Response) => {
    res.status(200).json(req.user);
});

mainRoute.post('/videos', VideosController.getAllVideos);
mainRoute.post('/videos/my-channel', authMiddleware, VideosController.getMyVideos);
mainRoute.post('/history', authMiddleware, VideosController.getHistoryVideos);
mainRoute.delete('/history/:id', authMiddleware, VideosController.deleteHistoryVideo);
mainRoute.get('/playlists', authMiddleware, PlaylistsController.getAllPlaylists);
mainRoute.post('/playlists/:url', authMiddleware, PlaylistsController.getPlaylistByUrl);
mainRoute.get('/channels', authMiddleware, ChannelsController.getChannels);
mainRoute.patch('/user/configure', authMiddleware, upload, UserController.updateUser);
mainRoute.delete('/user/configure', authMiddleware, UserController.unsetUserField);