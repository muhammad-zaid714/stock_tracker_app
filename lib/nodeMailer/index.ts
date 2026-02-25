import nodemailer from "nodemailer";
import { NEWS_SUMMARY_EMAIL_TEMPLATE, WELCOME_EMAIL_TEMPLATE } from "./templates";
import { getFormattedTodayDate } from "../utils";

export const transporter = nodemailer.createTransport({
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

export const sendNewsSummaryEmail = async({email, name, newsContent}: {email: string; name: string; newsContent: string}) => {
    const date = getFormattedTodayDate();
    const htmlTemplate = NEWS_SUMMARY_EMAIL_TEMPLATE
        .replace('{{date}}', date)
        .replace('{{newsContent}}', newsContent);
    
    const mailOptions = {
        from: 'Signalist <zaid@signalist.com>',
        to: email,
        subject: `Your Daily Market News Summary - ${date}`,
        html: htmlTemplate,
    };
    
    await transporter.sendMail(mailOptions);
}