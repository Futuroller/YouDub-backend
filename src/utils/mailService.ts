import nodemailer from 'nodemailer';//подключение библиотеки для отправки писем
import { API_URL } from '../config';//импорт переменной, в которой хранится домен сайта

const transporter = nodemailer.createTransport({//создаётся объект с настройками для отправки писем
    service: 'mail.ru',
    auth: {
        user: "no-reply.youdub@mail.ru",
        pass: "ypJ7VKe6QQAMzRwYMyhA"
    }
});

export const sendActivationEmail = async (email: string, activationLink: string) => {//функция для отправки эл. письма
    const url = `${API_URL}/auth/activate/${activationLink}`;//Ссылка для письма

    try {
        await transporter.sendMail({//Отправляется письмо с заданными настройками и содержанием
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