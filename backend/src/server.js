import express from 'express';
import {ENV} from './lib/env.js';
import path from 'path';


const app=express();

const __dirname=path.resolve();


app.get('/',(req,res)=>{
    res.status(200).json({message:'user is running'});
});

app.get('/Home',(req,res)=>{
    res.status(200).json({message:'Welcome to Home page'});
})

// make our app ready  for deployment
if(ENV.NODE_ENV=='development'){
    app.use(express.static(path.join(__dirname,'../frontend/dist')))

    app.get("/{*any}",(req,res)=>{
        res.sendFile(path.join(__dirname,'../frontend/dist/index.html'));
    })
}



app.listen(ENV.PORT,()=>{
    console.log("server is running on port",ENV.PORT);
})