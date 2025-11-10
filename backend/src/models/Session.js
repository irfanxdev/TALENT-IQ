import mongoose  from 'mongoose';

const sessionSchema= new mongoose.Schema({
    problem:{
        type:String,
        reqired:true,
    },
    difficulty:{
        type:String,
        enum:['easy','medium','hard'],
        required:true,
    },
    host:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,
    },
    participants:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        default:null,
    },
    status:{
        type:String,
        enum:["active","completed"],
        default:"active",
    },

    // stream vedio call id
    callId:{
        type:String,
        default:"",
    }
},({timestamps:true});

const Session =mongoose.model("Session",sessionSchema);

export default Session;