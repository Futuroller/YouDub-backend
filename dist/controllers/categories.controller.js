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
exports.categoriesController = void 0;
const categories_service_1 = require("../services/categories.service");
exports.categoriesController = {
    getAllCategories: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const categories = yield categories_service_1.categoriesService.getAllCategories();
            res.status(200).json({ categories });
        }
        catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Ошибка при получении категорий: ' + error });
        }
    }),
    getUsersCategories: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const categories = yield categories_service_1.categoriesService.getUserCategories(req.user.id);
            res.status(200).json({ categories });
        }
        catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Ошибка при получении категорий: ' + error });
        }
    }),
};
