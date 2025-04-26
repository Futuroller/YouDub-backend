import { categories, favorite_categories, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const categoriesService = {
    async getAllCategories() {
        const categories = await prisma.categories.findMany({
            orderBy: { name: 'asc' }
        });

        return categories;
    },
    async addCategoriesToUser(userId: number, categoriesArray: categories[]) {
        const userCategories = await prisma.favorite_categories.createMany({
            data: categoriesArray.map(c => ({
                id_user: userId,
                id_category: c.id
            }))
        });

        return userCategories;
    },
    async getUsersCategories(userId: number) {
        const categories = await prisma.favorite_categories.findMany({
            where: {
                id_user: userId
            },
            select: {
                categories: true
            }
        }).then(categories => categories.map(c => c.categories))

        return categories;
    },
};