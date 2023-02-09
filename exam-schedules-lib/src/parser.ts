import googleapis, {google, sheets_v4} from 'googleapis';
import fs from "fs";
import {ExamInfo} from "./interfaces/ExamInfo";
import {OAuth2Client} from "google-auth-library";
import Schema$ValueRange = sheets_v4.Schema$ValueRange;
import path from "path";

const spreadsheetIdPath = path.join(__dirname, "../../data/SpreadsheetId.json")

//return array of Spreadsheets' titles
function getExamDates(sheetsApi: googleapis.sheets_v4.Sheets, spreadsheetId: string): Promise<string[]> {
    return sheetsApi.spreadsheets
        .get({spreadsheetId})
        .then(res => res.data.sheets)
        .then(sheets => {
            return sheets!.map(sheet => `${sheet.properties!.title}!A2:G`)
        })
}

// Get spreadsheet ID from file
function getSpreadsheetId(): string {
    if (!fs.existsSync(spreadsheetIdPath)) {
        throw new Error(`SpreadsheetId.json not found in ../data/ directory`);
    }
    return JSON.parse(fs.readFileSync(spreadsheetIdPath).toString()).spreadsheetId;
}

// Returns array of examInfo for this date
function getValueRanges(ranges: string[], sheets: googleapis.sheets_v4.Sheets, authClient: OAuth2Client): Promise<Schema$ValueRange[]> {
    const request = {
        spreadsheetId: getSpreadsheetId(),
        ranges: ranges,
        auth: authClient,
    };

    return sheets.spreadsheets.values.batchGet(request)
        .then(response => {
            const data = response.data;
            return data.valueRanges || []
        })
}

export function getExamListForValueRanges(valueRanges: Schema$ValueRange[]): ExamInfo[] {
    return valueRanges.map(sheet => createExamInfosFromSheet(sheet)).flat()
}

export function createExamInfosFromSheet(sheet: Schema$ValueRange) {
    const rows = getRowsFromSheet(sheet)
    const date = sheet.range!.substring(1, 6) // getRowsFromSheet checks this
    return rows
        .filter(row => !hasMissingValues(row))
        .map(row => createExamInfoFromRow(row, date));
}

export function createExamInfoFromRow(row: string[], date: string): ExamInfo {
    let lecturersArray = row[2].split(",");
    lecturersArray = lecturersArray.map((lecturer: string) => {
        return lecturer.replace(".", " ").replace(/(\s)+/g, " ").trim();
    });
    let groupsArray = row[3].split(",");
    groupsArray = groupsArray.map((group: string) => {
        return group.trim();
    })
    return {
        date: date,
        time: row[0],
        subject: row[1],
        lecturers: lecturersArray,
        groups: groupsArray,
        university: row[4]
    }
}

export function hasMissingValues(row: any[]) {
    return row.length < 5 || row.includes(undefined) || row.includes('')
}

export function getRowsFromSheet(sheetResult: Schema$ValueRange) {
    if (!sheetResult.range) {
        return []
    }
    const rows = sheetResult.values
    if (!rows) {
        return [];
    }
    return rows
}


// Returns array of all exams
export async function getExamList(auth: OAuth2Client): Promise<ExamInfo[]> {
    const sheets = google.sheets({version: 'v4', auth})
    return getExamDates(sheets, getSpreadsheetId())
        .then((ranges: string[]) => getValueRanges(ranges, sheets, auth))
        .then((valueRanges: Schema$ValueRange[]) => getExamListForValueRanges(valueRanges))
        .then((result: ExamInfo[]) => {
            return result
        })
}
