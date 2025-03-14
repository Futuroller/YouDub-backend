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
exports.MainController = void 0;
const auth_service_1 = require("../services/auth.service");
const jwt_service_1 = require("../services/jwt.service");
const bcrypt_1 = __importDefault(require("bcrypt"));
exports.MainController = {
    getUserData: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
            const token = jwt_service_1.jwtService.createJwt(user);
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
};
