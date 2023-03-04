import {GoogleAuth} from "google-auth-library";
import {EmailOptions} from "./interfaces/EmailOptions";
import MailComposer from "nodemailer/lib/mail-composer";

require('dotenv').config();
const {google} = require('googleapis');

const SCOPES = ['https://www.googleapis.com/auth/gmail.send'];

function authorize(): GoogleAuth {
    return new google.auth.GoogleAuth({
        scopes: SCOPES,
        keyFile: process.env.MAIL_CREDENTIALS,
        subject: 'freeunicodes.contant@gmail.com'
    })
}

const encodeMessage = (message: Buffer) => {
    return Buffer.from(message).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};

const createMail = async (options: EmailOptions) => {
    const mailComposer = new MailComposer(options);
    const message = await mailComposer.compile().build();
    return encodeMessage(message);
};

export async function sendMail(options: EmailOptions) {
    const auth = authorize()
    const gmail = google.gmail({version: 'v1', auth: auth});
    const rawMessage = await createMail(options);
    return await gmail.users.messages.send({
        userId: 'me',
        resource: {
            raw: rawMessage,
        },
    });
}

