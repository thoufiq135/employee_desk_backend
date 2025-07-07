const jwt=require("./token.js")
const Express=require("express")
require("dotenv").config()
const {mongodbemp}=require("./mongodb.js")
const router=Express.Router()
const validdata=async (req,res,next)=>{
    const{mail,pass}=req.body
    if(!mail&&!pass){
        return res.status(400).json({ message: "Email and Password are required." });
    }else{
       
        const search = await mongodbemp.findOne({Email:mail})
         console.log(search)
        if(!search){
               console.log(search)
            res.status(400).json({message:"Invalid Email😔"})

        }else{
         
            const dbpassword=search?.Password
            if(dbpassword==pass){
                const dbrole= search?.Role
                console.log(dbrole)
                next()
            }else{
                
                res.status(400).json({message:"invalid password😔😔"})
            }
        }
  
    }
    
}
router.post("/",validdata, async (req,res)=>{
    const{mail,pass}=req.body
   
     const search = await mongodbemp.findOne({Email:mail})
    
         console.log(search)
         const role=search?.Role
         const naam=search?.name
         console.log(naam)
           const payload={mail,pass,role}
   const token= await jwt.sign(payload,process.env.KEY)
   console.log(token)
   res.cookie("AUTH",token,{
    httpOnly:true,
    secure:true,
    sameSite:"none",
    path:"/"
      
   }).status(200).json({message:role,name:naam,mail:mail})


})
module.exports=router;