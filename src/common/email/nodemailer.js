import nodemailer from "nodemailer";
import {config} from "dotenv";

config()
const transporter = nodemailer.createTransport({
    // service: 'Gmail',
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.USER_PASS
    }
});
export async function sendEmail(email, subject, body) {
    await transporter.sendMail({
        from: `"NGL-APP"<${process.env.USER_EMAIL}>`,
        to: email,
        subject: subject,
        html: body,
    })
}