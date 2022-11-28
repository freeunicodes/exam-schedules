const {google} = require('googleapis');
const {authorize} = require("./index");
const fs = require("fs");

interface ExamInfo {
    date: string,
    time: string,
    subject: string,
    lecturers: string,
    groups: string,
    university: string
}

const getSheets = async (sheets: any, spreadsheetId: any) => {
    let result = (await sheets.spreadsheets.get({
        spreadsheetId
    })).data.sheets;
    result = result.map((sheet: any) => {
        return sheet.properties.title
    })
    return result
}


function getSpreadsheetId(): string {
    if (!fs.existsSync("./data/SpreadsheetId.json")) {
        throw new Error(`SpreadsheetId.json not found in ./data/ directory`);
    }
    return JSON.parse(fs.readFileSync("./data/SpreadsheetId.json").toString()).spreadsheetId;
}

async function listMajors(auth: any) {
    const sheets = google.sheets({version: 'v4', auth});
    let ranges: string[] = [];
    await getSheets(sheets, getSpreadsheetId())
        .then((row: any) => {
            ranges = row;
        });

    ranges.map(async (range: string) => {
        const res = await sheets.spreadsheets.values.get({
            spreadsheetId: getSpreadsheetId(),
            range: `${range}!A2:G`,
        });
        const rows = res.data.values;
        if (!rows || rows.length === 0) {
            console.log('No data found.');
            return;
        }
        rows.forEach((row: any) => {
            let examInfo: ExamInfo = {
                date: range,
                time: row[0],
                subject: row[1],
                lecturers: row[2],
                groups: row[3],
                university: row[4]
            }
            console.log(examInfo);
        });
    });
}

authorize().then(listMajors).catch(console.error);