import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();
const databaseName = 'authenticate';
export const  connection = ()=>{ mongoose.connect(`${process.env.DATABASE_URI}/${databaseName}`,{
}).then(() =>{
    console.log("MONGODB connected successfully..");
}).catch((err)=> console.log('some issue in mongodb connection ', err));
}
