import Session from '../models/Session.js';
import {streamClient} from "../lib/stream.js";
import { chatClient } from '../lib/stream.js';

export async function createSession(req,res){
    try{
        const {problem,difficulty}=req.body;
        const userId=req.user._id; // mongoDb ID
        const clerkId=req.user.clerkId; // clerk ID

        if(!problem || !difficulty){
            return res.status(400).json({message:"problem and difficulty are required"});
        }

        //generate a unique call id for stream Video call 
        const callId=`session_${Date.now()}_${Math.random().toString(36).substring(7)}`;

        // create session in Db
        const session=await Session.create({problem,difficulty,host:userId,callId});

        // Create session video call 
        await streamClient.video.call("default",callId).getOrCreate({
            data:{
                created_by_id:clerkId,
                custom:{problem,difficulty,sessionId:session._id.toString()},
            },
        });

        // chat messaging

        const channel=chatClient.channel("messaging",callId,{
            name:`${problem} Session`,
            created_by_id:clerkId,
            members:[clerkId]
        })

        await channel.create();

        // future opotion for sedding the mail 

        res.status(201).json(session);
    }catch(error){
    console.log("Error in createSession Controller:",error.message);
    res.status(500).json({message:"Internal Server Error"});
    }
}

export async function getActiveSessions(req,res){
   try{
      const sessions=await Session.find({status:"active"})
      .populate("host","name profileImage email clerkId")
      .sort({createdAt:-1}) //decending order
      .limit(20) //show only 20 latest session created

      res.status(200).json({sessions});
     
   }catch(error){
    console.log("Error in getAcriveSessions Controller:",error.message);
    res.status(500).json({message:"Internal Server Error"});
   }
}

export async function getMyRecentSessions(req,res){
    try{
   
    const userId=req.user._id;
     // get the sessionm where user is either host or participant 
     const sessions=await Session.find({
        status:"completed",
        $or:[{host:userId},{participants:userId}],
     })
     .sort({createdAt:-1})
     .limit(20);

     res.status(200).json({sessions})

    }catch(error){
        console.log("Error in getMyRecentSessions Constroller:",error.message);
        res.status(500).json({message:"Internal server error"});
    }
}

export async function getSessionById(req,res){  
    try{
        const {id}=req.params;
        const session=await Session.find(id)
        .populate("host","name email profileImage clerkId")
        .populate(" participants","name email profileImage clerkId")

        if(!session) res.status(404).json({message:"Session is not find"});

        res.status(200).json({session});
    }catch(error){
        console.log("Error in getSessionById",error.message);
        res.status(500).json({message:"Internal session Error"});
    }
}

export async function joinSession(req,res){
    try{
        const {id}=req.params
        const userId=req.user._id
        const clerkId=req.user.clerkId

        const session =await Session.findById(id);
        if(!session) return res.status(404).json({message:"Session not found"});

        if(session.status!=="active"){
            return res.status(400).json({message:"Cannot join a completed session"});
        }

        if(session.host.toString()===userId.toString()){
          return res.status(400).json({message:"Host cannot join their own session as participant"});
        }

        // check if session is already full- hads a participant

        if(session.participants) return res.status(400).json({"messaging":"Session is full"});

        session.participants=userId
        await session.save();

        const channel=chatClient.channel("messaging",session.callId);
        await channel.addMembers([clerkId]);

        res.status(200).json({session});
        }catch(error){

        console.log("Error in joinSession",error.message);
        res.status(500).json({message:"Internal session Error"});

    }
}

export async function endSession(req,res){

    try{
    const {id}=req.params
    const  userId=req.user._id;

    const session =await Session.findById(id);

    if(!session) return res.status(404).json({message:"session  not found"})
    
        // check if user is the host
    // we take the session from  the string thats why we change into the string
    if(session.host.toString()!==userId.toString()){
        return res.status(403).json({message:"Only the host can end the session"});
    }

    if(session.status==="completed"){
        return res.status(400).json({message:"session is already completed"});
    }
   
    // delete the stream call
    const call=streamClient.video.call("dafault",session.callId);
    await call.delete({hard:true});

    // delete the chat channel
    const channel=chatClient.channel("messaging",session.callId);
    await channel.delete({hard:true});

    session.status="completed"
    await session.save();

    res.status(200).json({session,message:"Session ended successfully"});

    }catch(error){
        console.log("Error in sessionEnd",error.message);
        res.status(500).json({message:"Internal session Error"});
    }

}