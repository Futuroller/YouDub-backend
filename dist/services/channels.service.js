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
exports.channelsService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
exports.channelsService = {
    getChannels(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const subscriptions = yield prisma.subscriptions.findMany({
                    where: { id_subscriber: userId },
                    select: {
                        subscribed_at: true,
                        users_subscriptions_id_channelTousers: {
                            select: {
                                id: true,
                                username: true,
                                avatar_url: true,
                                description: true,
                                tagname: true,
                            }
                        }
                    },
                    orderBy: { subscribed_at: 'desc' }
                });
                const subscribedChannels = subscriptions.map(sub => (Object.assign({ subscribed_at: sub.subscribed_at }, sub.users_subscriptions_id_channelTousers)));
                return subscribedChannels;
            }
            catch (error) {
                console.error("Ошибка при получении подписок:", error);
                return [];
            }
        });
    },
    subscribe(channelId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const subscriptions = yield prisma.subscriptions.create({
                    data: {
                        id_channel: channelId,
                        id_subscriber: userId,
                        subscribed_at: new Date(),
                    }
                });
                return { isFollowed: true };
            }
            catch (error) {
                console.error("Ошибка подписки:", error);
                throw new Error("Ошибка подписки:" + error);
            }
        });
    },
    unsubscribe(channelId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const subscriptions = yield prisma.subscriptions.delete({
                    where: {
                        id_subscriber_id_channel: {
                            id_subscriber: userId,
                            id_channel: channelId,
                        }
                    }
                });
                return { isFollowed: false };
            }
            catch (error) {
                console.error("Ошибка отписки:", error);
                throw new Error("Ошибка отписки:" + error);
            }
        });
    },
    isFollowed(channelId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const isFollowed = (yield prisma.subscriptions.findFirst({
                    where: {
                        id_channel: channelId,
                        id_subscriber: userId
                    }
                })) ? true : false;
                return isFollowed;
            }
            catch (error) {
                throw new Error("Ошибка проверки подписки: " + error);
            }
        });
    },
};
