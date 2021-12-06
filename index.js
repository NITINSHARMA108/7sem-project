const express=require('express');
const mongoose = require('mongoose');
const User = require('./models/User');
const app=express();
require('dotenv').config();
//Set up default mongoose connection
var mongoDB = process.env.connection;
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});

//Get the default connection
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
const accountSid=process.env.ACCOUNT_SID;
const auth_token=process.env.AUTH_TOKEN;
const client=require('twilio')(accountSid,auth_token);

app.get('/',(req,res)=>{
    res.send('hello');
})

app.post('/',(req,res)=>{
    const number=req.body.number;
    const otp=Math.floor(1000+Math.random()*9000);
    const ttl=1*60*1000;
    const expires=Date.now()+ttl;
    const data=`${number}${otp}${expires}`;
    const hash=crypto.createHmac('sha256',smskey).update(data).digest('hex');
    const fullhash=`${hash}.${expires}`;
    client.messages.create({
        body:`Your one time password for learnwithvariable login is ${otp}`,
        from:+17325079694,
        to:number

    }).then((message)=>console.log(message)).catch((err)=>console.log('error occured',err))

    res.status(200).send({number:number,hash:fullhash,otp:otp});
});


app.post('/register',(req,res)=>{
    const {name, phone} = req.body;
    User.create({name: name,phone: phone})
    .catch((err)=>{
        res.status(403);
        res.json({"error":"unable to insert data"});
        res.end();
    })
    res.status(200).json({"message": "data inserted successfully"});
})



app.listen(8080,(err)=>{
    console.log('listening to port 8080');
})