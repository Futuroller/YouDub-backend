import { NextFunction, Request, Response } from "express";
import { userService } from '../services/auth.service'
import { jwtService } from "../services/jwt.service";

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.headers.authorization) {
        res.status(401).json({ message: 'Неавторизованный вход' });
        return;
    }

    const token = req.headers.authorization.split(' ')[1];
    try {
        const userId = await jwtService.getUserIdByToken(token);

        if (userId) {
            const user: any = await userService.findUser('id', userId);
            console.log(userId);
            const { password_hash, is_banned, activation_link, ...publicUserData } = user;
            req.user = publicUserData;
            next();
        } else {
            res.send(401);
        }
    } catch (error) {
        res.status(400).json({ message: `Ошибка auth.middleware: ${error}` });
    }

};