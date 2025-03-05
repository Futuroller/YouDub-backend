import { Request, Response } from "express";
import { userService } from "../services/auth.service";
import bcrypt from 'bcrypt'

export const addUser = async (req: Request, res: Response) => {//business

    const body = req.body;

    const hashedPassword = await bcrypt.hash(body.password, 5);

    const userData = {
        username: body.username,
        registration_date: new Date(),
        email: body.email,
        password_hash: hashedPassword,
        id_role: 1
    }

    try {
        await userService.createUser(userData);
        const user = await userService.findUser(userData);
        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Ошибка регистрации пользователя', error });
    }
};