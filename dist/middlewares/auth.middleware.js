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
exports.authMiddleware = void 0;
const user_service_1 = require("../services/user.service");
const jwt_service_1 = require("../services/jwt.service");
const authMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.headers.authorization) {
        res.status(401).json({ message: 'Неавторизованный вход' });
        return;
    }
    const token = req.headers.authorization.split(' ')[1];
    try {
        const userId = yield jwt_service_1.jwtService.getUserIdByToken(token);
        if (userId) {
            const user = yield user_service_1.userService.findUser('id', userId);
            // console.log(userId);
            const { password_hash, is_banned, activation_link } = user, publicUserData = __rest(user, ["password_hash", "is_banned", "activation_link"]);
            req.user = publicUserData;
            next();
        }
        else {
            res.send(401);
        }
    }
    catch (error) {
        res.status(400).json({ message: `Ошибка auth.middleware: ${error}` });
    }
});
exports.authMiddleware = authMiddleware;
