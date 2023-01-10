import {OAuth2Client} from "google-auth-library";
import path from 'path';
import {authenticate} from '@google-cloud/local-auth';

const fs = require('fs').promises;
const {google} = require('googleapis');

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = path.resolve('../data/', 'token.json');
const CREDENTIALS_PATH = path.resolve('../data/', 'credentials.json');

function loadSavedCredentialsIfExist(): Promise<OAuth2Client> {
    return fs.readFile(TOKEN_PATH, 'utf-8')
        .then((content: string) => {
            const credentials = JSON.parse(content);
            return google.auth.fromJSON(credentials);
        })
}

async function saveCredentials(client: OAuth2Client) {
    const content = await fs.readFile(CREDENTIALS_PATH);
    const keys = JSON.parse(content);
    const key = keys.installed || keys.web;
    const payload = JSON.stringify({
        type: 'authorized_user',
        client_id: key.client_id,
        client_secret: key.client_secret,
        refresh_token: client.credentials.refresh_token,
    });
    await fs.writeFile(TOKEN_PATH, payload);
}

/**
 * Load or request or authorization to call APIs.
 *
 */
export function authorize(): Promise<OAuth2Client> {
    return loadSavedCredentialsIfExist()
        .catch(_ => {
            return authenticate({
                scopes: SCOPES,
                keyfilePath: CREDENTIALS_PATH,
            })
            .then(async client => {
                if (client.credentials) {
                    await saveCredentials(client);
                }
                return client;
            });
        })
}