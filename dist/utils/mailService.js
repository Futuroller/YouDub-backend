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
exports.sendActivationEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const config_1 = require("../config");
const transporter = nodemailer_1.default.createTransport({
    service: 'mail.ru',
    auth: {
        user: "no-reply.youdub@mail.ru",
        pass: "ypJ7VKe6QQAMzRwYMyhA"
    }
});
const sendActivationEmail = (email, activationLink) => __awaiter(void 0, void 0, void 0, function* () {
    const url = `${config_1.API_URL}/auth/activate/${activationLink}`;
    try {
        yield transporter.sendMail({
            from: '"YouDub" <no-reply.youdub@mail.ru>',
            to: email,
            subject: 'Подтвердите ваш аккаунт',
            html: `<h2>Добро пожаловать в YouDub!</h2>
                   <p>Для активации аккаунта перейдите по сылке:</p>
                   <a href="${url}">${url}</a>`
        });
    }
    catch (error) {
        console.error("Ошибка при отправке письма: " + error);
    }
});
exports.sendActivationEmail = sendActivationEmail;
