import { Request, Response, Router } from "express";
import { body } from "express-validator";
import { userController } from "../controllers/user.controller";
export const authRoute = Router();

const titleValidation = body('title').isLength({ min: 3, max: 25 })
    .withMessage('Title length should be from 3 to 25 symbols');

authRoute.post('/signup', userController.addUser);//registration
authRoute.post('/login', userController.authUser);//auth
authRoute.get('/activate/:token', userController.activateUser);//activation link
