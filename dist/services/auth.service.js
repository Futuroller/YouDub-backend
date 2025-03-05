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
exports.userService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
exports.userService = {
    createUser(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield prisma.users.create({
                    data: userData
                });
            }
            catch (error) {
                console.log(error);
            }
            finally {
                yield prisma.$disconnect();
            }
        });
    },
    findUser(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield prisma.users.findFirstOrThrow({
                    where: {
                        id: userData.id
                    }
                });
            }
            catch (error) {
                return { message: "Пользователь не найден" };
            }
            finally {
                yield prisma.$disconnect();
            }
        });
    }
};
