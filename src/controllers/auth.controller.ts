import { Request, Response } from "express";
import { userService } from "../services/auth.service";
import { jwtService } from "../services/jwt.service";
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { sendActivationEmail } from "../utils/mailService";


export const AuthController = {//business
    addUser: async (req: Request, res: Response) => {
        const body = req.body;
        const hashedPassword = await bcrypt.hash(body.password, 5);

        const activationLink = crypto.randomUUID();

        const userData = {
            username: body.username,
            registration_date: new Date(),
            email: body.email,
            password_hash: hashedPassword,
            id_role: 1,
            activation_link: activationLink,
        };

        try {
            await userService.createUser(userData);
            const user = await userService.findUser('email', userData.email);

            if (!user || !('email' in user)) {
                res.status(500).json({ message: "Ошибка сервера" });
                return;
            }

            await sendActivationEmail(user.email, activationLink);

            res.status(201).json(user);
        } catch (error) {
            res.status(500).json({ message: 'Ошибка регистрации пользователя', error });
        }
    },

    authUser: async (req: Request, res: Response) => {
        const body = req.body;

        const userData = {
            email: body.email,
            password: body.password
        };

        try {
            const user = await userService.findUser('email', userData.email);

            if (!user || !('password_hash' in user)) {
                res.status(404).json({ message: "Пользователь не найден" });
                return;
            }

            const isValid = await bcrypt.compare(userData.password, user.password_hash);

            if (!isValid) {
                res.status(400).json({ message: "Неверный пароль" });
                return;
            }

            const token = await jwtService.createJwt(user);

            const { password_hash, is_banned, activation_link, ...publicUserData } = user;//исключаем данные, которые не стоит передавать на сервер

            res.status(200).json({
                message: "Успешный вход",
                token,
                user: publicUserData
            });
        } catch (error) {
            res.status(500).json({ message: 'Ошибка авторизации: ', error });
        }
    },

    activateUser: async (req: Request, res: Response) => {
        const activationLink = req.params.token;

        try {
            const user = await userService.findUser('activation_link', activationLink);

            if (!user || !('id' in user)) {
                res.status(400).json({ message: "Некорректная ссылка активации!" });
                return;
            }

            if ('is__activated' in user && user.is__activated) {
                res.status(200).json({ message: "Аккаунт уже активирован!" });
                return;
            }

            await userService.updateUser(user.id, { is__activated: true, activation_link: null });// 

            res.status(200).json({ message: "Аккаунт успешно активирован!" });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Ошибка активации аккаунта', error });
        }
    },
};