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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const user_service_1 = require("../services/user.service");
const jwt_service_1 = require("../services/jwt.service");
const bcrypt_1 = __importDefault(require("bcrypt"));
const crypto_1 = __importDefault(require("crypto"));
const mailService_1 = require("../utils/mailService");
const playlists_service_1 = require("../services/playlists.service");
const deleteFile_1 = require("../utils/deleteFile");
exports.UserController = {
    addUser: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const body = req.body;
        const hashedPassword = yield bcrypt_1.default.hash(body.password, 5);
        const activationLink = crypto_1.default.randomUUID();
        const userData = {
            username: body.username,
            registration_date: new Date(),
            email: body.email,
            password_hash: hashedPassword,
            id_role: 1,
            activation_link: activationLink,
        };
        try {
            yield user_service_1.userService.createUser(userData);
            const user = yield user_service_1.userService.findUser('email', userData.email);
            if (!user || !('email' in user)) {
                res.status(500).json({ message: "Ошибка сервера" });
                return;
            }
            yield (0, mailService_1.sendActivationEmail)(user.email, activationLink);
            res.status(201).json(user);
        }
        catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Ошибка регистрации пользователя', error });
        }
    }),
    authUser: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const body = req.body;
        const userData = {
            email: body.email,
            password: body.password
        };
        try {
            const user = yield user_service_1.userService.findUser('email', userData.email);
            if (!user || !('password_hash' in user)) {
                res.status(404).json({ message: "Пользователь не найден" });
                return;
            }
            const isValid = yield bcrypt_1.default.compare(userData.password, user.password_hash);
            if (!isValid) {
                res.status(400).json({ message: "Неверный пароль" });
                return;
            }
            const token = yield jwt_service_1.jwtService.createJwt(user);
            const { password_hash, is_banned, activation_link } = user, publicUserData = __rest(user, ["password_hash", "is_banned", "activation_link"]); //исключаем данные, которые не стоит передавать на сервер
            res.status(200).json({
                message: "Успешный вход",
                token,
                user: publicUserData
            });
        }
        catch (error) {
            res.status(500).json({ message: 'Ошибка авторизации: ', error });
        }
    }),
    activateUser: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const activationLink = req.params.token;
        try {
            const user = yield user_service_1.userService.findUser('activation_link', activationLink);
            if (!user || !('id' in user)) {
                res.status(400).json({ message: "Некорректная ссылка активации!" });
                return;
            }
            if ('is__activated' in user && user.is__activated) {
                res.status(200).json({ message: "Аккаунт уже активирован!" });
                return;
            }
            yield user_service_1.userService.updateUser(user.id, { is__activated: true, activation_link: null });
            yield playlists_service_1.playlistsService.createDefaultPlaylists(user.id);
            res.status(200).json({ message: "Аккаунт успешно активирован!" });
        }
        catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Ошибка активации аккаунта', error });
        }
    }),
    updateUser: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        try {
            const userId = req.user.id;
            const user = yield user_service_1.userService.findUser('id', userId);
            const updatedFields = Object.assign({}, req.body);
            if (req.files) {
                const files = req.files;
                if ('avatar_url' in user && ((_a = files.avatar) === null || _a === void 0 ? void 0 : _a[0])) {
                    (0, deleteFile_1.deleteFile)(`avatars/${user.avatar_url}`);
                    updatedFields.avatar_url = files.avatar[0].filename;
                }
                if ('channel_header_url' in user && ((_b = files.header) === null || _b === void 0 ? void 0 : _b[0])) {
                    (0, deleteFile_1.deleteFile)(`headers/${user.channel_header_url}`);
                    updatedFields.channel_header_url = files.header[0].filename;
                }
            }
            const updatedUser = yield user_service_1.userService.updateUser(userId, updatedFields);
            res.status(200).json(updatedUser);
        }
        catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Ошибка обновления пользователя', error });
        }
    }),
    unsetUserField: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const userId = req.user.id;
            const { avatar_url, channel_header_url } = req.body;
            const unsetedFields = {};
            if (avatar_url) {
                (0, deleteFile_1.deleteFile)(`avatars/${avatar_url}`);
                unsetedFields.avatar_url = null;
                console.log('deleted: ' + avatar_url);
            }
            if (channel_header_url) {
                (0, deleteFile_1.deleteFile)(`headers/${channel_header_url}`);
                unsetedFields.channel_header_url = null;
            }
            const user = yield user_service_1.userService.updateUser(userId, unsetedFields);
            res.status(200).json(user);
        }
        catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Ошибка обновления пользователя', error });
        }
    }),
};
