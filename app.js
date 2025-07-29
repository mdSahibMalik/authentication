import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { connection } from './databases/connection.js';
import { errorMiddleware } from './middleware/errorHandler.js';

export const app = express()
app.get('/', (req, res)=>{
    res.status(200).send('hello ! ');
})





app.use(cors({
    origin:"*",
    methods:["GET","POST","DELETE","PUT"],
    credentials:true
}))
app.use(cookieParser);
app.use(express.urlencoded({extended:true}));
connection()
app.use(errorMiddleware)