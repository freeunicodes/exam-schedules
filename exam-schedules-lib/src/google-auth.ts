import {OAuth2Client} from "google-auth-library";
import path from 'path';
import {authenticate} from '@google-cloud/local-auth';
import {google} from 'googleapis';

const fs = require('fs').promises;

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = path.join('../data/', 'token.json');
const CREDENTIALS_PATH = path.join('../data/', 'credentials.json');

function loadSavedCredentialsIfExist() {
    try {
        return fs.readFile(TOKEN_PATH)
            .then((content: string) => {
                const credentials = JSON.parse(content);
                return google.auth.fromJSON(credentials);
            })

    } catch (err) {
        return null;
    }
}

function saveCredentials(client: OAuth2Client) {
    return fs.readFile(CREDENTIALS_PATH)
        .then((content: string) => {
            const keys = JSON.parse(content);
            const key = keys.installed || keys.web;
            const payload = JSON.stringify({
                type: 'authorized_user',
                client_id: key.client_id,
                client_secret: key.client_secret,
                refresh_token: client.credentials.refresh_token,
            });
            return fs.writeFile(TOKEN_PATH, payload)
                .then(() => client);
        });

}

/**
 * Load or request or authorization to call APIs.
 *
 */
export function authorize(): Promise<OAuth2Client> {
    return loadSavedCredentialsIfExist()
        .then((client: OAuth2Client) => {
            if (client) {
                return client;
            }
            authenticate({
                scopes: SCOPES,
                keyfilePath: CREDENTIALS_PATH,
            })
                .then((client: OAuth2Client) => {
                    if (client.credentials) {
                        return saveCredentials(client)
                            .then(() => client)
                    }
                    return client;
                })

        })


}