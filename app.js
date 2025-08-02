import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { connection } from './databases/connection.js';
import { errorMiddleware } from './middleware/errorHandler.js';
import userRouter from './routes/user.routes.js';

export const app = express()

app.use(cors({
    origin:"*",
    methods:["GET","POST","DELETE","PUT"],
    credentials:true
}))

app.use(cookieParser());
app.use(express.urlencoded({extended:true}));
app.use(express.json())
connection()

app.get('/', (req, res)=>{
    res.status(200).send('hello ! ');
})

// router setup 
app.use('/api/v1/users', userRouter);
// http://localhost:8000/api/v1/users/register
app.use(errorMiddleware);