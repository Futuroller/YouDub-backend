import { Request, Response, Router } from "express";
import { coursesRepository, CourseType } from "../controllers/courses-repository";
import { body } from "express-validator";
import { inputValidation } from "../middlewares/input-validation-middleware";
import { AuthController } from "../controllers/auth.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
export const mainRoute = Router();

mainRoute.get('/', authMiddleware, (req: Request, res: Response) => {
    res.status(200).json(req.user);
});



