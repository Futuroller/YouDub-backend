import nodemailer from 'nodemailer';
import { API_URL } from '../config';

const transporter = nodemailer.createTransport({
    service: 'mail.ru',
    auth: {
        user: "no-reply.youdub@mail.ru",
        pass: "ypJ7VKe6QQAMzRwYMyhA"
    }
});

export const sendActivationEmail = async (email: string, activationLink: string) => {
    const url = `${API_URL}/auth/activate/${activationLink}`;

    try {
        await transporter.sendMail({
            from: '"YouDub" <no-reply.youdub@mail.ru>',
            to: email,
            subject: 'Подтвердите ваш аккаунт',
            html: `<h2>Добро пожаловать в YouDub!</h2>
                   <p>Для активации аккаунта перейдите по сылке:</p>
                   <a href="${url}">${url}</a>`
        });
    } catch (error) {
        console.error("Ошибка при отправке письма: " + error);
    }
};