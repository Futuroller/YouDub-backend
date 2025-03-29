import { Request, Response } from "express";
import { channelsService } from "../services/channels.service";

export const ChannelsController = {//business
    getChannels: async (req: Request, res: Response) => {
        try {
            const channels = await channelsService.getChannels(req.user.id);

            res.status(200).json({ channels });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Ошибка при получении каналов: ' + error });
        }
    }
};