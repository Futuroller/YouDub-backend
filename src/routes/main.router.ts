import { Request, Response, Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { VideosController } from "../controllers/videos.controller";
export const mainRoute = Router();

mainRoute.get('/', authMiddleware, (req: Request, res: Response) => {
    res.status(200).json(req.user);
});

mainRoute.post('/videos', VideosController.getAllVideos);