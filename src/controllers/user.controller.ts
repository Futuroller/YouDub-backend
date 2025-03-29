import { Request, response, Response } from "express";
import { userService } from "../services/user.service";
import { jwtService } from "../services/jwt.service";
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { sendActivationEmail } from "../utils/mailService";
import { playlistsService } from "../services/playlists.service";
import { users } from "@prisma/client";


export const UserController = {//business
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
            console.log(error);
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

            await userService.updateUser(user.id, { is__activated: true, activation_link: null });
            await playlistsService.createDefaultPlaylists(user.id);

            res.status(200).json({ message: "Аккаунт успешно активирован!" });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Ошибка активации аккаунта', error });
        }
    },
    updateUser: async (req: Request, res: Response) => {
        try {
            const userId = req.user.id;
            const updatedFields = { ...req.body };

            if (req.files) {
                const files = req.files as { [fieldname: string]: Express.Multer.File[] };

                if (files.avatar?.[0]) {
                    updatedFields.avatar_url = files.avatar[0].filename;
                    console.log('Загружен аватар:', files.avatar[0].filename);
                }

                if (files.header?.[0]) {
                    updatedFields.channel_header_url = files.header[0].filename;
                    console.log('Загружена шапка:', files.header[0].filename);
                }
            }
            const user = await userService.updateUser(userId, updatedFields);

            res.status(200).json(user);
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Ошибка обновления пользователя', error });
        }
    },
};