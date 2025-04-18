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
exports.reactionService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
exports.reactionService = {
    isReacted(userId, videoId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const reaction = yield prisma.history.findUnique({
                    where: {
                        id_user_id_video: {
                            id_user: userId,
                            id_video: videoId
                        }
                    },
                    select: {
                        id_reaction: true
                    }
                });
                if (!reaction)
                    return null;
                return reaction;
            }
            catch (error) {
                console.log(error);
            }
            finally {
                yield prisma.$disconnect();
            }
        });
    },
};
