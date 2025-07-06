const Express=require("express")
const nodemailer=require("nodemailer")
const router=Express.Router()
require("dotenv").config()
const jwt=require("jsonwebtoken")
const {mongodbemp}=require("./mongodb.js")
const check=async(req,res,next)=>{
const {mail,pass,name,role}=req.body
console.log(mail)
console.log(pass)
console.log(name)
console.log(role)

const cametoken=req.cookies.AUTH
try{
   constverify_token= await jwt.verify(cametoken,process.env.KEY)
if(!constverify_token){
    res.status(404).json({message:"Token Expired"})
}
}catch(e){
    console.log("error at token verify")
}
console.log(cametoken)

const foundemail=await mongodbemp.findOne({Email:mail})
console.log(foundemail)
if(foundemail){
    res.status(400).json({message:"Email Exists"})
}else if(!cametoken){
    res.status(400).json({message:"session expired"})
}else{
    next()
}
}
router.post("/",check,async (req,res)=>{
console.log("came")
const{mail,pass,name,role,pho}=req.body
try{
    const insertemp=await mongodbemp.insertMany({name:name,Email:mail,Password:pass,Role:role,Mobile:pho})
    
  console.log("Employee inserted:", insertemp);
  const transporter=nodemailer.createTransport({
    service:"gmail",
    auth:{
        user:process.env.email,
        pass:process.env.password

    }
  })
const mailopt={
    from:"shaikno150@gmail.com",
    to:mail,
    subject:"Welcom to Employee desk",
    text:`Greetings ${name}, \n\n You have Successfully added to Employee desk system as a ${role}`
}
await transporter.sendMail(mailopt,(error,info)=>{
    if(error){
        console.log(error)
    }else{
        console.log("Welcome Email send🥳")
    }
})
  return res.status(200).json({message:"success"})
}catch(e){
    res.status(404).json({message:"server is busy"})
}
if(insertemp){
    res.status(200)
}
})
module.exports=router;