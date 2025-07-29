import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();

export const  connection = ()=>{ mongoose.connect(process.env.DATABASE_URI,{
    dbName:"/authenticate"
}).then(() =>{
    console.log("MONGODB connected successfully..");
}).catch((err)=> console.log('some issue in mongodb connection ', err));
}
