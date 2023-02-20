import nodemailer from "nodemailer"
import express from "express";

export const emailerRouter = express.Router()
emailerRouter.post("", (req, res) => {
    const {name, email, message} = req.body;

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.GMAIL,
            pass: process.env.PASSWORD
        },
    });

    const mailOptions = {
        to: process.env.GMAIL,
        from: process.env.GMAIL,
        subject: "Exam Schedules - from " + name,
        text: "Email author: " + email + "\n" + message,
    };

    transporter.sendMail(mailOptions, (error, _) => {
        if (error) {
            res.status(500).send("Something went wrong.");
        } else {
            res.status(200).send("Success");
        }
    });
});