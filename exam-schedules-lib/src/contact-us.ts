import {EmailOptions} from "./interfaces/EmailOptions";
import nodemailer from "nodemailer"
import fs from "fs";

export async function sendMail(options: EmailOptions) {
    if (!process.env.MAIL_SECRET) {
        throw ("Could not read MAIL_SECRET from environment")
    }
    if (!process.env.GMAIL) {
        throw ("Could not read GMAIL from environment")
    }
    const data = fs.readFileSync(process.env.MAIL_SECRET)
    const pass = JSON.parse(data.toString()).password

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.GMAIL,
            pass: pass
        },
    });
    return await transporter.sendMail(options);
}

