import nodeMailer from "nodemailer";
import ErrorHandler from "../middleware/errorHandler.js";

export const sendMail = async({email, subject, message})=>{
    try {
        const transporter = nodeMailer.createTransport({
        host: process.env.SMTP_HOST,
        service: "gmail",
        port: process.env.SMTP_PORT,
        auth:{
            user: process.env.APP_EMAIL,
            pass: process.env.APP_EMAIL_PASSWORD
        }
    })


    const options = {
        from: process.env.SMTP_MAIL,
        to: email,
        subject,
        html: message
    }
    await transporter.sendMail(options);
    } catch (error) {
        return next(new ErrorHandler("Failed to send verification email", 500))
    }
}