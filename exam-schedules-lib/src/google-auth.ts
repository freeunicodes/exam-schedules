import {OAuth2Client} from "google-auth-library";
import path from 'path';
import {authenticate} from '@google-cloud/local-auth';

import fs from 'fs'
require('dotenv').config();
const {google} = require('googleapis');

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = path.resolve('../data/', 'token.json');
const CREDENTIALS_PATH = path.resolve('../data/', 'credentials.json');

function loadCredentials() {
    if (!fs.existsSync(CREDENTIALS_PATH)) {
        const envCredentials = process.env.CREDENTIALS
        fs.writeFileSync(CREDENTIALS_PATH, envCredentials!)
    }
}

async function saveToken(client: OAuth2Client) {
    const content = process.env.CREDENTIALS;
    const keys = JSON.parse(content!);
    const key = keys.installed || keys.web;
    const payload = JSON.stringify({
        type: 'authorized_user',
        client_id: key.client_id,
        client_secret: key.client_secret,
        refresh_token: client.credentials.refresh_token,
    });
    await fs.promises.writeFile(TOKEN_PATH, payload);
}

export function authorize(): Promise<OAuth2Client> {
    loadCredentials()
    return fs.promises.readFile(TOKEN_PATH, 'utf-8')
        .then((content: string) => {
            return google.auth.fromJSON(JSON.parse(content));
        })
        .catch(async () => {
            const envToken = process.env.TOKEN
            if (envToken) {
                await fs.promises.writeFile(TOKEN_PATH, envToken);
                return google.auth.fromJSON(JSON.parse(envToken))
            }
            return authenticate({
                scopes: SCOPES,
                keyfilePath: CREDENTIALS_PATH,
            }).then(async auth => {
                if (auth.credentials)
                    await saveToken(auth);
                return auth
            })
        })
}
