import { Request, Response } from "express";
import { channelsService } from "../services/channels.service";
import { userService } from "../services/user.service";
import { videosService } from "../services/videos.service";

export const channelsController = {//business
    getChannels: async (req: Request, res: Response) => {
        try {
            const channels = await channelsService.getChannels(req.user.id);

            res.status(200).json({ channels });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Ошибка при получении каналов: ' + error });
        }
    },
    getChannelByTagname: async (req: Request, res: Response) => {
        try {
            const tagname = req.params.tagname;
            const preChannel = await userService.findUser('tagname', tagname);
            if (!preChannel) {
                res.status(500).json({ message: 'Канал не найден' });
                return;
            }
            const { activation_link, is_banned, ban_reason, id, id_role, is__activated, password_hash, ...publicChannelData } = preChannel;//исключаем данные, которые не стоит передавать на сервер
            const isFollowed = await channelsService.isFollowed(preChannel.id, req.user.id)
            const channel = {
                ...publicChannelData,
                isFollowed
            }

            res.status(200).json({ channel });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Ошибка при получении канала: ' + error });
        }
    },
    subscribe: async (req: Request, res: Response) => {
        try {
            const tagname = req.params.tagname;
            const channel = await userService.findUser('tagname', tagname);
            if (!channel) {
                res.status(500).json({ message: 'Канал не найден' });
                return;
            }
            const isFollowed = await channelsService.subscribe(channel.id, req.user.id)

            res.status(200).json({ isFollowed });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Ошибка при подписке: ' + error });
        }
    },
    unsubscribe: async (req: Request, res: Response) => {
        try {
            const tagname = req.params.tagname;
            const channel = await userService.findUser('tagname', tagname);
            if (!channel) {
                res.status(500).json({ message: 'Канал не найден' });
                return;
            }
            const isFollowed = await channelsService.unsubscribe(channel.id, req.user.id)

            res.status(200).json({ isFollowed });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Ошибка при отписке: ' + error });
        }
    },
};