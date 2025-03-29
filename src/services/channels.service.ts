import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const channelsService = {

    async getChannels(userId: number) {
        try {
            // Получаем подписки пользователя
            const subscriptions = await prisma.subscriptions.findMany({
                where: { id_subscriber: userId },
                select: {
                    users_subscriptions_id_channelTousers: { // Достаем пользователей (каналы)
                        select: {
                            id: true,
                            username: true,
                            avatar_url: true,
                            description: true,
                            subscribers_count: true
                        }
                    }
                },
                orderBy: { subscribed_at: 'desc' }
            });

            const subscribedChannels = subscriptions.map(sub => sub.users_subscriptions_id_channelTousers);

            return subscribedChannels;
        } catch (error) {
            console.error("Ошибка при получении подписок:", error);
            return [];
        }
    }

};