import mongoose  from "mongoose";

import {ENV} from "./env.js";

export const connectDB=async()=>{
    try{
        if(!ENV.DB_URL){
            throw new Error("DB_URL  is not defined in env file");
        }
        const conn=await mongoose.connect(ENV.DB_URL)
        console.log("connected to mongoDB",conn.connection.host);    
    }catch(err){
        console.log("error to connect with mongoose",err);
        process.exit(1);
        // 0 means success and 1 means failure
    }
}