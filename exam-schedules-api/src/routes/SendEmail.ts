import nodemailer from "nodemailer"
import express from "express";

const sendEmail = async(req: any, _: any) => {
    const {name, email, message} = req.body;

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.GMAIL,
            pass: process.env.PASSWORD
        },
    });

    await transporter.sendMail({
        to: process.env.GMAIL, // sender address
        from: process.env.GMAIL, // list of receivers
        subject: "Exam Schedules - from " + name, // Subject line
        text: "Email author: " + email + "\n" + message, // plain text body
    });
};

export const emailerRouter = express.Router()

emailerRouter.use(sendEmail)