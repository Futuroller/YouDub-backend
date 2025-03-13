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
            return await prisma.users.findFirstOrThrow({
                where: {
                    [field]: value
                }
            });
        } catch (error) {
            return { message: "Пользователь не найден" };
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