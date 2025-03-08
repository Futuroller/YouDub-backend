import { Request, Response, Router } from "express";
import { coursesRepository, CourseType } from "../controllers/courses-repository";
import { body } from "express-validator";
import { inputValidation } from "../middlewares/input-validation-middleware";
import { AuthController } from "../controllers/auth.controller";
export const authRoute = Router();

const titleValidation = body('title').isLength({ min: 3, max: 25 })
    .withMessage('Title length should be from 3 to 25 symbols');

authRoute.post('/signup', AuthController.addUser);//registration

authRoute.post('/login', AuthController.authUser);//auth

authRoute.get('/activate/:token', AuthController.activateUser);//activation link

authRoute.put('/:id', async (req: Request, res: Response) => {

});

authRoute.delete('/:id', async (req: Request, res: Response) => {

});
