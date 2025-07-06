const express=require("express")
const nodemailer=require("nodemailer")
const route=express.Router()
const{mongodbemp,datamodel} =require( "./mongodb")
require("dotenv").config()
const check= async (req,res,next)=>{
   
const{naam,email,intime,outtime,perintime,perouttime,per,overalltime,task}=req.body
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);
    const employee=await mongodbemp.findOne({Email:email})
     const existing = await datamodel.findOne({
      Employee_ID: employee._id,
      date: { $gte: startOfDay, $lte: endOfDay },
    });

    if (existing) {
       
      return res.status(400).json({
        message: "You have already submitted the form today.",
       
      });
    
    }else{
   
           next()
    }

}

route.post("/",check,async (req,res)=>{
    const{naam,email,intime,outtime,perintime,perouttime,per,overalltime,task}=req.body
    console.log(naam)
    console.log(email)
    console.log(intime)
    console.log(outtime)
    console.log(perintime)
    console.log(perouttime)
    console.log(per)
    console.log(overalltime)
    console.log(task)

const employee=await mongodbemp.findOne({Email:email})
 console.log("can add data")
   
if(naam&&email&&intime&&outtime&&overalltime&&task){
             
    if(employee){
    try{
        const insert=await datamodel.create({
       
                Employee_ID:employee._id,
                login_Time:intime,
                logout_Time:outtime,
                Permission_From:perintime|| "N/A",
                Permission_to:perouttime|| "N/A",
                Reason:per|| "N/A",
                No_of_hours:overalltime,
                Work_summary:task,
                  status: "Present",
           
            

        })

        if(insert){
            const transport=nodemailer.createTransport({
                service:"gmail",
                auth:{
                    user:process.env.email,
                    pass:process.env.password
                }
            })
            const mailotp={
                from:process.env.email,
    to:email,
    subject:"Form Received✅",
    text:`Thankyou ${naam}, \n\n You have Successfully Submitted to days form `
            }
          await transport.sendMail(mailotp)
          console.log("email send")
    res.status(200).json({message:"Submitted✅"})
}else{
      res.status(500).json({message:"server issue"})
}

    }catch(e){
        console.log("err at modb form upload")
    }
}
}else{
     console.log("can add data")
}
})






module.exports=route;