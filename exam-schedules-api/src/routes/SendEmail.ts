import nodemailer from "nodemailer"
import express from "express";
import {EmailOptions} from "exam-schedules-lib";
import {sendMail} from "exam-schedules-lib";

export const emailerRouter = express.Router()
emailerRouter.post("", (req, res) => {
    const {name, email, message} = req.body;

    const mailOptions : EmailOptions= {
        to: process.env.GMAIL,
        cc: "agurg21@freeuni.edu.ge",
        subject: "Exam Schedules - from " + name,
        text: "Email author: " + email + "\n" + message,
    };

    console.log(sendMail(mailOptions))
});