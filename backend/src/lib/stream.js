import {StreamChat} from 'stream-chat';
import {StreamClient} from '@stream-io/node-sdk';
import {ENV} from "./env.js";

const apiKey=ENV.STREAM_API_KEY;
const apiSecret=ENV.STREAM_API_SECRET;

if(!apiKey  || !apiSecret){
    console.error("Stream API key and secret must be set in enviroment variables");
}

export const chatClient=StreamChat.getInstance(apiKey,apiSecret); //this is for chat features like messgae, channels etc

export const streamClient=new StreamClient(apiKey,apiSecret); // this is user for video calls

export const upsertStreamUser=async (userData)=>{
    try{
        await chatClient.upsertUser(userData);
        console.log("Stream user upserted successfully:",userData);
    }catch(error){
        console.error("error upserting user to stream",error);
    }
};

export const deleteStreamUser=async(userId)=>{
    try{
        await chatClient.deleteUser(userId);
        console.log("Stream user deleted successfully:",userId);
    }catch(error){
        console.error("error deleting stream user",error);
    }
}

// todp: add another method to generate the token