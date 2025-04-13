import { Request, Response } from "express";
import { categoriesService } from "../services/categories.service";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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