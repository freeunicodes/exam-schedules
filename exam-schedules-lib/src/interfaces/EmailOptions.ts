import {Readable} from "stream";
import {Address, AttachmentLike} from "nodemailer/lib/mailer";

export interface EmailOptions {
    to: string | Address | Array<string | Address> | undefined;
    cc: string | Address | Array<string | Address> | undefined;
    subject: string | undefined;
    text: string | Buffer | Readable | AttachmentLike | undefined;
}