import express, { Request, Response } from 'express';
import cors from 'cors';
import { coursesRoute } from './routes/courses-router';
import { authRoute } from './routes/auth.router';
export const app = express();
const port = 3000;

const jsonBodyMiddleware = express.json();

app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.use(jsonBodyMiddleware);

app.use('/api/auth', authRoute);
app.use('/api/courses', coursesRoute);

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
}); 