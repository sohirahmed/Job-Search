
import nodemailer from "nodemailer";

export const sendEmail =async (to, subject,html)=>{

const transporter = nodemailer.createTransport({

    service:"gmail",
    auth: {
        user: "sohirahmed129@gmail.com",
        pass: "kahuoqtzmradwubu",
    },
});

const info = await transporter.sendMail({
    from: '"So7irA7med 👻" <sohirahmed129@gmail.com>', 
    to:to ? to:"" , 
    subject: subject ? subject:"hi" ,  
    html: html ? html:"hello ",
});

console.log( info);
if(info.accepted.length){
    return true
}
return false;

}