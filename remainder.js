const cron=require("node-cron")
const {mongodbemp,datamodel}=require("./mongodb")
const twilio=require("twilio")

require("dotenv").config()
const nodemailer=require("nodemailer")
const client=twilio(process.env.twilio_sid,process.env.twilio_token)
console.log("sending remainders")
cron.schedule("0 17-22 * * * ",async()=>{
    const today=new Date()
today.setHours(0,0,0,0);
    console.log("sending remainder")
    try{
        const employee=await mongodbemp.find()
        for(const emp of employee){
            if(emp.Role!=="Admin") continue;
            const filled=await datamodel.findOne({
                Employee_ID:emp._id,
                date:{
                    $gte:today,
                    $lt:new Date(today.getTime()+24*60*60*1000),
                }
            })
            if(!filled){
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
                    subject:"daily Form Remainder⚠️",
                    text:`hi ${emp.name},\n\n it looks like you haven't submitted your work form today. Please fill it out before the end of the day.`
                })
            if(emp.Mobile){
                const phone=`whatsapp:+91${emp.Mobile}`
                await client.messages.create({
                    from:process.env.TWILIO_WHATSAPP_NUMBER,
                    to:phone,
                    body:`hi ${emp.name},\n\n it looks like you haven't submitted your work form today. Please fill it out before the end of the day.`,
                })
                console.log("remainders send")
            }
            }
        }
    }catch(e){
        console.log("error sending mail")
    }
})