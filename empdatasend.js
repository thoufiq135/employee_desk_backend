const express=require("express")

const route=express.Router()
const{mongodbemp,datamodel} =require( "./mongodb")
require("dotenv").config()
route.get("/",async(req,res)=>{
    const token=req.query.mail
    console.log(token)
    if(token){
         try {
    const mail = req.query.mail;
    console.log("Received mail:", mail);


    const employee = await mongodbemp.findOne({ Email: mail });

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    const data = await datamodel.find({ Employee_ID: employee._id }).sort({ date: -1 });

    res.status(200).json(data);
  } catch (err) {
    console.error("Error fetching employee data:", err);
    res.status(500).json({ message: "Server error" });
  }
    }

})
module.exports=route;