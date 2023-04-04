import express from "express";
import {EmailOptions, sendMail} from "exam-schedules-lib";

export const emailerRouter = express.Router()
emailerRouter.post("", (req, res, next) => {
    const {name, email, message} = req.body;
    if (!process.env.RECIPIENTS) {
        res.status(500).send("No RECIPIENTS variable in env file")
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
            res.status(200).send()
            next()
        }))
        .catch(err => {
            res.status(500).send(err)
        })
});