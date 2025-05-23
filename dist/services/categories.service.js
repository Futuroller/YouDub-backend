"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoriesService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
exports.categoriesService = {
    getAllCategories() {
        return __awaiter(this, void 0, void 0, function* () {
            const categories = yield prisma.categories.findMany({
                orderBy: { name: 'asc' }
            });
            return categories;
        });
    },
    addCategoriesToUser(userId, categoriesArray) {
        return __awaiter(this, void 0, void 0, function* () {
            const userCategories = yield prisma.favorite_categories.createMany({
                data: categoriesArray.map(c => ({
                    id_user: userId,
                    id_category: c.id
                }))
            });
            return userCategories;
        });
    },
    getUserCategories(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const categories = yield prisma.favorite_categories.findMany({
                where: {
                    id_user: userId
                },
                select: {
                    categories: true
                }
            }).then(categories => categories.map(c => c.categories));
            return categories;
        });
    },
    updateUserCategories(userId, categoriesArray) {
        return __awaiter(this, void 0, void 0, function* () {
            const userCategories = yield prisma.favorite_categories.deleteMany({
                where: {
                    id_user: userId
                }
            });
            const newCategories = yield prisma.favorite_categories.createMany({
                data: categoriesArray.map(c => ({
                    id_user: userId,
                    id_category: c.id
                }))
            });
            return newCategories;
        });
    },
};
