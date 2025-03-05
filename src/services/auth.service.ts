import { PrismaClient } from "@prisma/client";

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

    async findUser(userData: any) {
        try {
            return await prisma.users.findFirstOrThrow({
                where: {
                    id: userData.id
                }
            });
        } catch (error) {
            return { message: "Пользователь не найден" };
        } finally {
            await prisma.$disconnect();
        }
    }
}