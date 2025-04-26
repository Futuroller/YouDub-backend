import { Request, Response } from "express";
import { categoriesService } from "../services/categories.service";
import { categories, favorite_categories, PrismaClient } from "@prisma/client";

export const categoriesController = {
    getAllCategories: async (req: Request, res: Response) => {
        try {
            const categories = await categoriesService.getAllCategories();
            res.status(200).json({ categories });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Ошибка при получении категорий: ' + error });
        }
    },
};