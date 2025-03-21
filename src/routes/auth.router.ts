import { Request, Response, Router } from "express";
import { body } from "express-validator";
import { AuthController } from "../controllers/auth.controller";
export const authRoute = Router();

const titleValidation = body('title').isLength({ min: 3, max: 25 })
    .withMessage('Title length should be from 3 to 25 symbols');

authRoute.post('/signup', AuthController.addUser);//registration
authRoute.post('/login', AuthController.authUser);//auth
authRoute.get('/activate/:token', AuthController.activateUser);//activation link
