import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const categoriesService = {
    async getAllCategories() {
        const categories = await prisma.categories.findMany({
            orderBy: { name: 'asc' }
        });

        return categories;
    },
};