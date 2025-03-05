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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addUser = void 0;
const auth_service_1 = require("../services/auth.service");
const bcrypt_1 = __importDefault(require("bcrypt"));
const addUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const hashedPassword = yield bcrypt_1.default.hash(body.password, 5);
    const userData = {
        username: body.username,
        registration_date: new Date(),
        email: body.email,
        password_hash: hashedPassword,
        id_role: 1
    };
    try {
        yield auth_service_1.userService.createUser(userData);
        const user = yield auth_service_1.userService.findUser(userData);
        res.status(201).json(user);
    }
    catch (error) {
        res.status(500).json({ message: 'Ошибка регистрации пользователя', error });
    }
});
exports.addUser = addUser;
