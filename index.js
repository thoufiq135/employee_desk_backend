const express=require("express")

const app=express()
const {connectdb,mongodbemp,datamodel}=require("./mongodb.js")
const loginroute=require("./login.js")
const addemproute=require("./empadd.js")
const cookieparser=require("cookie-parser")
const remove_Employee=require("./empremove.js")
const token_verify=require("./verify_token.js")
const fill_form=require("./empformadd.js")
const senddataemp=require("./empdatasend.js")
const adminroutes = require("./admindatasend.js");
require("./remainder.js")
require("./absent.js")

const cors = require("cors")
app.use(cors({
    origin: "https://employee-desk-frontend.vercel.app", 
  credentials: true,
}))
const port=5000;
app.use(express.json())
app.use(cookieparser())
connectdb()
app.get("/",async (req,res)=>{
const data=await mongodbemp.find()
console.log(data)
    res.send("<h1>Hello World</h1>")
})
app.use("/Remove_Emp",remove_Employee)
app.use("/Login",loginroute);
app.use("/NewUser",addemproute)
app.use("/verify_token",token_verify)
app.use("/fill_form",fill_form)
app.use("/empdata",senddataemp)
app.use("/admin", adminroutes);
app.listen(port,()=>{
    console.log(`app is running at port ${port}`)
})