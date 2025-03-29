import express, { Request, Response } from 'express';
import cors from 'cors';
import { authRoute } from './routes/auth.router';
import { mainRoute } from './routes/main.router';
export const app = express();
const port = 3000;

(BigInt.prototype as any).toJSON = function () {
    return Number(this);
};

const jsonBodyMiddleware = express.json();

app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.use(jsonBodyMiddleware);

app.use('/api/auth', authRoute);
app.use('/api/main', mainRoute);
app.use('/uploads', express.static('uploads')); // Раздача статики

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
}); 