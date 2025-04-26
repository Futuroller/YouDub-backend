import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const channelsService = {

    async getChannels(userId: number) {
        try {
            const subscriptions = await prisma.subscriptions.findMany({
                where: { id_subscriber: userId },
                select: {
                    subscribed_at: true,
                    users_subscriptions_id_channelTousers: {
                        select: {
                            id: true,
                            username: true,
                            avatar_url: true,
                            description: true,
                            tagname: true,
                        }
                    }
                },
                orderBy: { subscribed_at: 'desc' }
            });

            const subscribedChannels = subscriptions.map(sub => ({
                subscribed_at: sub.subscribed_at,
                ...sub.users_subscriptions_id_channelTousers
            }));

            return subscribedChannels;
        } catch (error) {
            console.error("Ошибка при получении подписок:", error);
            return [];
        }
    },
    async subscribe(channelId: number, userId: number) {
        try {
            const subscriptions = await prisma.subscriptions.create({
                data: {
                    id_channel: channelId,
                    id_subscriber: userId,
                    subscribed_at: new Date(),
                }
            });

            return { isFollowed: true };
        } catch (error) {
            console.error("Ошибка подписки:", error);
            throw new Error("Ошибка подписки:" + error);
        }
    },
    async unsubscribe(channelId: number, userId: number) {
        try {
            const subscriptions = await prisma.subscriptions.delete({
                where: {
                    id_subscriber_id_channel: {
                        id_subscriber: userId,
                        id_channel: channelId,
                    }
                }
            });

            return { isFollowed: false };
        } catch (error) {
            console.error("Ошибка отписки:", error);
            throw new Error("Ошибка отписки:" + error);
        }
    },
    async isFollowed(channelId: number, userId: number) {
        try {
            const isFollowed = await prisma.subscriptions.findFirst({
                where: {
                    id_channel: channelId,
                    id_subscriber: userId
                }
            }) ? true : false;

            return isFollowed;
        } catch (error) {
            throw new Error("Ошибка проверки подписки: " + error);
        }
    },
};