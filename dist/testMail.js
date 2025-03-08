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
const nodemailer_1 = __importDefault(require("nodemailer"));
const transporter = nodemailer_1.default.createTransport({
    service: "mail.ru",
    auth: {
        user: "no-reply.youdub@mail.ru",
        pass: "ypJ7VKe6QQAMzRwYMyhA" // Вставь сюда пароль приложения
    }
});
function sendTestEmail() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const info = yield transporter.sendMail({
                from: '"Тест почты" <no-reply.youdub@mail.ru>',
                to: "futurolxl@gmail.com", // Укажи другой свой email или тестовый
                subject: "Проверка SMTP",
                text: "Если ты видишь это письмо — пароль для приложений работает!",
            });
            console.log("✅ Письмо отправлено:", info.messageId);
        }
        catch (error) {
            console.error("❌ Ошибка при отправке:", error);
        }
    });
}
sendTestEmail();
