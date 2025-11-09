import {  requireAuth } from "@clerk/express";
import User from '../models/User.js';


export const  protectRoute=[
    requireAuth(),
    async (req,res,next)=>{
        try{
            const clerkId=req.auth.userId;
            if(!clerkId) return res.status(401).json({message:"Unauthorized user"});

            // find the user in db
            const user=await User.findOne({clerkId});
            if(!user) return res.status(404).json({message:"user not found"});

            // attach user to req
            req.user=user;
            
            next();
    }catch(error){
        console.error("error in protect route middlewaree",error);
        res.status(500).json({message:"server error in protect route middleware"});
    }
    }
];
