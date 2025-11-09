import { clerkClient } from "@clerk/express";
import { chatClient } from "../lib/stream.js";
import { err } from "inngest/types";

export async  function getStreamToken(req,res){
    try{
        // use clerk id for stream not mongoDb-id it should match the id we have in the stream dashboard
        const token=chatClient.createToken(req,user,clerkId);
        res.stauts(200).json({
            token,
            userId:req.user.clerkId,
            userName:req.user.name,
            userImage:req.user.image,
        });
    }catch(error){
      console.log("Error in getStreamToken controller:",error.message);
      res.status(500).json({message:"Internal Server Error"});
    }
}