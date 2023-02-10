import {GoogleAuth} from "google-auth-library";

require('dotenv').config();
const {google} = require('googleapis');

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.

export function authorize(): GoogleAuth {
    return new google.auth.GoogleAuth({
        scopes: SCOPES,
        keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS
    })
}
