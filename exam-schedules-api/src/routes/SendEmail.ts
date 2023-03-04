import express from "express";
import {EmailOptions, sendMail} from "exam-schedules-lib";

export const emailerRouter = express.Router()
emailerRouter.post("", (req, res, next) => {
    const {name, email, message} = req.body;
    if (!process.env.RECIPIENTS) {
        next(new Error("There is not recipients"))
        return
    }
    const recipients = process.env.RECIPIENTS.split(',').map((mailAdress) => mailAdress.trim())

    const mailOptions: EmailOptions = {
        to: recipients,
        from: process.env.GMAIL,
        subject: "Exam Schedules - from " + name,
        text: "Email author: " + email + "\n" + message,
    };

    sendMail(mailOptions)
        .then((_ => {
            next()
        }))
        .catch(err => {
            console.log(err)
            next(err)
        })
});