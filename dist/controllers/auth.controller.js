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
exports.AuthController = void 0;
const auth_service_1 = require("../services/auth.service");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto_1 = __importDefault(require("crypto"));
const mailService_1 = require("../utils/mailService");
exports.AuthController = {
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
            yield auth_service_1.userService.createUser(userData);
            const user = yield auth_service_1.userService.findUser('email', userData.email);
            if (!user || !('email' in user)) {
                res.status(500).json({ message: "Ошибка сервера" });
                return;
            }
            yield (0, mailService_1.sendActivationEmail)(user.email, activationLink);
            res.status(201).json(user);
        }
        catch (error) {
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
            const user = yield auth_service_1.userService.findUser('email', userData.email);
            if (!user || !('password_hash' in user)) {
                res.status(404).json({ message: "Пользователь не найден" });
                return;
            }
            const isValid = yield bcrypt_1.default.compare(userData.password, user.password_hash);
            if (!isValid) {
                res.status(400).json({ message: "Неверный пароль" });
                return;
            }
            const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email, role: user.id_role }, process.env.JWT_SECRET || "SECRET_KEY", { expiresIn: "7d" });
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
        console.log("Запрос на активацию с token:", activationLink);
        try {
            const user = yield auth_service_1.userService.findUser('activation_link', activationLink);
            if (!user || !('id' in user)) {
                res.status(400).json({ message: "Некорректная ссылка активации!" });
                return;
            }
            if ('is__activated' in user && user.is__activated) {
                res.status(200).json({ message: "Аккаунт уже активирован!" });
                return;
            }
            yield auth_service_1.userService.updateUser(user.id, { is__activated: true, activation_link: null }); // 
            res.status(200).json({ message: "Аккаунт успешно активирован!" });
        }
        catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Ошибка активации аккаунта', error });
        }
    }),
};
