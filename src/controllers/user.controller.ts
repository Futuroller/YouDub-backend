import { Request, Response } from "express";
import { userService } from "../services/user.service";
import { jwtService } from "../services/jwt.service";
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { sendActivationEmail } from "../utils/mailService";
import { playlistsService } from "../services/playlists.service";
import { deleteFile } from "../utils/deleteFile";
import { generateUniqueName } from "../utils/generateUniqueName";
import { categoriesService } from "../services/categories.service";

export const userController = {//business
    addUser: async (req: Request, res: Response) => {
        const body = req.body;
        const hashedPassword = await bcrypt.hash(body.password, 5);
        let tagname;

        try {
            do {
                tagname = generateUniqueName(body.username);
                const user = await userService.findUser('tagname', tagname);
                if (!user) {
                    break;
                }
            } while (true);
        } catch (error) {
            console.log(error);
        }

        const isEmailUnique = !await userService.findUser('email', body.email);

        if (!isEmailUnique) {
            res.status(409).json({ message: 'Пользователь с таким email уже зарегистрирован' });
            return;
        }

        const activationLink = crypto.randomUUID();

        const userData = {
            username: body.username,
            registration_date: new Date(),
            email: body.email,
            password_hash: hashedPassword,
            id_role: 1,
            activation_link: activationLink,
            tagname: tagname
        };

        try {
            await userService.createUser(userData);
            const user = await userService.findUser('email', userData.email);

            if (!user || !('email' in user)) {
                res.status(500).json({ message: "Ошибка сервера" });
                return;
            }
            const categories = await categoriesService.addCategoriesToUser(user.id, body.categories);
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

            const { password_hash, activation_link, ...publicUserData } = user;//исключаем данные, которые не стоит передавать на сервер

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
            const user = await userService.findUser('id', userId);
            if (user === null) {
                res.status(404).json({ message: 'Пользователь не найден' });
                return;
            }

            const updatedFields = { ...req.body };

            if (req.files) {
                const files = req.files as { [fieldname: string]: Express.Multer.File[] };

                if ('avatar_url' in user && files.avatar?.[0]) {
                    deleteFile(`avatars/${user.avatar_url}`)
                    updatedFields.avatar_url = files.avatar[0].filename;
                }

                if ('channel_header_url' in user && files.header?.[0]) {
                    deleteFile(`headers/${user.channel_header_url}`);
                    updatedFields.channel_header_url = files.header[0].filename;
                }
            }
            if (updatedFields.categories) {
                const categories = await categoriesService.updateUserCategories(req.user.id, JSON.parse(updatedFields.categories));
                delete updatedFields.categories;
            }
            const updatedUser = await userService.updateUser(userId, updatedFields);

            res.status(200).json(updatedUser);
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Ошибка обновления пользователя', error });
        }
    },
    unsetUserField: async (req: Request, res: Response) => {
        try {
            const userId = req.user.id;
            const { avatar_url, channel_header_url } = req.body;
            const unsetedFields: any = {};

            if (avatar_url) {
                deleteFile(`avatars/${avatar_url}`);
                unsetedFields.avatar_url = null;
                console.log('deleted: ' + avatar_url)
            }

            if (channel_header_url) {
                deleteFile(`headers/${channel_header_url}`);
                unsetedFields.channel_header_url = null;
            }

            const user = await userService.updateUser(userId, unsetedFields);

            res.status(200).json(user);
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Ошибка обновления пользователя', error });
        }
    },
    banUser: async (req: Request, res: Response) => {
        try {
            const userId = req.user.id;
            const tagname = req.params.tagname;
            const banReason = req.body.banReason;
            const user = await userService.findUser('id', userId);
            if (user && user.id_role !== 2) {
                res.status(403).json({ message: 'Недостаточно прав' })
                return;
            }

            const selectedUser = await userService.findUser('tagname', tagname);
            if (!selectedUser) {
                res.status(400).json({ message: 'Пользователь не найден' })
                return;
            }
            const bannedUser = await userService.updateUser(selectedUser.id, { is_banned: true, ban_reason: banReason });

            res.status(200).json(bannedUser);
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Ошибка обновления пользователя', error });
        }
    },
    unbanUser: async (req: Request, res: Response) => {
        try {
            const userId = req.user.id;
            const tagname = req.params.tagname;
            const user = await userService.findUser('id', userId);
            if (user && user.id_role !== 2) {
                res.status(403).json({ message: 'Недостаточно прав' })
                return;
            }

            const selectedUser = await userService.findUser('tagname', tagname);
            if (!selectedUser) {
                res.status(400).json({ message: 'Пользователь не найден' })
                return;
            }
            const unbannedUser = await userService.updateUser(selectedUser.id, { is_banned: false, ban_reason: null });

            res.status(200).json(unbannedUser);
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Ошибка обновления пользователя', error });
        }
    },
};