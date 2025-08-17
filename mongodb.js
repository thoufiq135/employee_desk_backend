const mongo=require("mongoose")
require("dotenv").config();
const connectdb=()=>{
    mongo.connect(process.env.MONGO_URI).then((e)=>console.log("Connected to database")).catch((e)=>console.log("error connecting to database",e))
}
const employee_Schema=new mongo.Schema({
    name:String,
    Email:String,
    Password:String,
    Mobile:Number,
    Role:String
})
const mongodbemp=mongo.model("employees",employee_Schema)
const employeedata=new mongo.Schema({
    Employee_ID:{type:mongo.Schema.Types.ObjectId,ref:"Employees"},
    login_Time:String,
    logout_Time:String,
    Permission_From:String,
    Permission_to:String,
    Reason:String,
    No_of_hours:String,
    Work_summary:String,
     status: {
    type: String,
    enum: ["Present", "Absent"],
    default: "Present"
  },
    date:{
        type:Date,
        default:Date.now
    }

})
const datamodel=mongo.model("Employee_data",employeedata)
module.exports={connectdb,mongodbemp,datamodel};

