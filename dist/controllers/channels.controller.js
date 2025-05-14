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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.channelsController = void 0;
const channels_service_1 = require("../services/channels.service");
const user_service_1 = require("../services/user.service");
exports.channelsController = {
    getChannels: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const channels = yield channels_service_1.channelsService.getChannels(req.user.id);
            res.status(200).json({ channels });
        }
        catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Ошибка при получении каналов: ' + error });
        }
    }),
    getChannelByTagname: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const tagname = req.params.tagname;
            const preChannel = yield user_service_1.userService.findUser('tagname', tagname);
            if (!preChannel) {
                res.status(500).json({ message: 'Канал не найден' });
                return;
            }
            const { activation_link, id, id_role, is__activated, password_hash } = preChannel, publicChannelData = __rest(preChannel, ["activation_link", "id", "id_role", "is__activated", "password_hash"]); //исключаем данные, которые не стоит передавать на сервер
            const isFollowed = yield channels_service_1.channelsService.isFollowed(preChannel.id, req.user.id);
            const channel = Object.assign(Object.assign({}, publicChannelData), { isFollowed });
            res.status(200).json({ channel });
        }
        catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Ошибка при получении канала: ' + error });
        }
    }),
    subscribe: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const tagname = req.params.tagname;
            const channel = yield user_service_1.userService.findUser('tagname', tagname);
            if (!channel) {
                res.status(500).json({ message: 'Канал не найден' });
                return;
            }
            const isFollowed = yield channels_service_1.channelsService.subscribe(channel.id, req.user.id);
            res.status(200).json({ isFollowed });
        }
        catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Ошибка при подписке: ' + error });
        }
    }),
    unsubscribe: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const tagname = req.params.tagname;
            const channel = yield user_service_1.userService.findUser('tagname', tagname);
            if (!channel) {
                res.status(500).json({ message: 'Канал не найден' });
                return;
            }
            const isFollowed = yield channels_service_1.channelsService.unsubscribe(channel.id, req.user.id);
            res.status(200).json({ isFollowed });
        }
        catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Ошибка при отписке: ' + error });
        }
    }),
};
