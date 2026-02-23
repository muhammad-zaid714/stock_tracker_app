import nodemailer from "nodemailer";
import { WELCOME_EMAIL_TEMPLATE } from "./templates";
export const transporter =nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.NODEMAILER_EMAIL!,
      pass: process.env.NODEMAILER_PASSWORD!,
    },
  });
  export const sendWelcomeEmail = async({email,name,intro}:WelcomeEmailData)=>{
    const htmltemplate = WELCOME_EMAIL_TEMPLATE.replace('{{name}}', name).replace('{{intro}}', intro)
    const mailOptions = {
        from:'Signalist <zaid@signalist.com>',
        to: email,
        subject: 'Welcome to Signalist!',
        html: htmltemplate,
    }
    await transporter.sendMail(mailOptions)
    
}