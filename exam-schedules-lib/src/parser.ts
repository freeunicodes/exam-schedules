import googleapis, {google, sheets_v4} from 'googleapis';
import {ExamInfo} from "./interfaces/ExamInfo";
import {GoogleAuth} from "google-auth-library";
import Schema$ValueRange = sheets_v4.Schema$ValueRange;
import createLogger from 'logging';

const logger = createLogger(__filename);

function getExamDates(sheetsApi: googleapis.sheets_v4.Sheets, spreadsheetId: string | undefined): Promise<string[]> {
    return sheetsApi.spreadsheets
        .get({spreadsheetId})
        .then(res => res.data.sheets)
        .then(sheets => {
            return sheets!.map(sheet => `${sheet.properties!.title}!A2:G`)
        })
}

// Get spreadsheet ID from file
function getSpreadsheetId(): string {
    const spreadSheetId = process.env.SPREADSHEET_ID
    if (spreadSheetId === undefined || spreadSheetId == '') {
        throw("Could not read Spreadsheet ID from environment, application will not work!")
    }
    return spreadSheetId
}

// Returns array of examInfo for this date
function getValueRanges(ranges: string[], sheets: googleapis.sheets_v4.Sheets, authClient: GoogleAuth): Promise<Schema$ValueRange[]> {
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
export function getExamList(auth: GoogleAuth): Promise<ExamInfo[]> {
    logger.debug("Trying to create API with auth...")
    const sheets = google.sheets({version: 'v4', auth})
    logger.debug("Successfully created sheets API")
    return getExamDates(sheets, getSpreadsheetId())
        .then((ranges: string[]) => getValueRanges(ranges, sheets, auth))
        .then((valueRanges: Schema$ValueRange[]) => getExamListForValueRanges(valueRanges))
        .then((result: ExamInfo[]) => {
            return result
        })
}
