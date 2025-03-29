import { Request, Response, Router } from "express";
import { body } from "express-validator";
import { UserController } from "../controllers/user.controller";
export const authRoute = Router();

const titleValidation = body('title').isLength({ min: 3, max: 25 })
    .withMessage('Title length should be from 3 to 25 symbols');

authRoute.post('/signup', UserController.addUser);//registration
authRoute.post('/login', UserController.authUser);//auth
authRoute.get('/activate/:token', UserController.activateUser);//activation link
