import { PrismaClient, users } from "@prisma/client";

const prisma = new PrismaClient();

export const userService = {
    async createUser(userData: any) {
        try {
            return await prisma.users.create({
                data: userData
            });
        } catch (error) {
            console.log(error);
        } finally {
            await prisma.$disconnect();
        }
    },

    async findUser(field: keyof users, value: any) {
        try {
            const user = await prisma.users.findFirstOrThrow({
                where: {
                    [field]: value
                },
            });

            const subscribersCount = await prisma.subscriptions.count({//Подписчики
                where: {
                    id_channel: user.id
                }
            });

            const subscriptionsCount = await prisma.subscriptions.count({//Подписки
                where: {
                    id_subscriber: user.id
                }
            });

            return {
                ...user,
                subscribersCount,
                subscriptionsCount
            };
        } catch (error) {
            return null;
        } finally {
            await prisma.$disconnect();
        }
    },
    async updateUser(userId: number, updatedData: object) {
        try {
            const updatedUser = await prisma.users.update({
                where: { id: userId },
                data: updatedData,
            });
            return updatedUser;
        } catch (error) {
            throw new Error(`Ошибка при обновлении пользователя: ${error}`);
        }
    },
};