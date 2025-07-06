const cron=require("node-cron")
const {mongodbemp,datamodel}=require("./mongodb")
const twilio=require("twilio")

require("dotenv").config()
const nodemailer=require("nodemailer")
const client=twilio(process.env.twilio_sid,process.env.twilio_token)
cron.schedule("59 23 * * * ",async()=>{
    const today=new Date()
    today.setHours(0 , 0 , 0 ,0);
    const tommorow=new Date(today.getTime()+24*60*60*1000);
    try{
        const employee=await mongodbemp.find()
    
            for(const emp of employee){
                if(emp.Role!=="Admin") continue;
            const filled = await datamodel.findOne({
                Employee_ID:emp._id,
                date:{$gte:today,$lt:tommorow}
            })
            if(!filled){
            await datamodel.create({
                Employee_ID:emp._id,
                    login_Time:"N/A",
                    logout_Time:"N/A",
                    Permission_From:"N/A",
                    Permission_to:"N/A",
                    Reason:"N/A",
                    No_of_hours:"N/A",
                    Work_summary:"N/A",
                     status: "Absent",
                    date:new Date()
            })
            const transport=nodemailer.createTransport({
                service:"gmail",
                auth:{
                     user:process.env.email,
                        pass:process.env.password
                }
            })
            await transport.sendMail({
                 from:process.env.email,
                    to:emp.Email,
                    subject:"Absent⚠️",
                    text:`hi ${emp.name},\n\n it looks like you haven't submitted your work form today. It will be considered as absent`
            })
              if(emp.Mobile){
                const phone=`whatsapp:+91${emp.Mobile}`
                await client.messages.create({
                    from:process.env.TWILIO_WHATSAPP_NUMBER,
                    to:phone,
                    body:`hi ${emp.name},\n\n it looks like you haven't submitted your work form today. It will be considered as absent`,
                })
                console.log("remainders send")}
        }
        }
        
        
    }catch(e){
        console.log("error  at absent")
    }
})