import googleapis, {google, sheets_v4} from 'googleapis';
import fs from "fs";
import {ExamInfo} from "./interfaces/ExamInfo";
import {OAuth2Client} from "google-auth-library";
import Schema$ValueRange = sheets_v4.Schema$ValueRange;

const spreadsheetdIdPath = "../data/SpreadsheetId.json"

//return array of Spreadsheets' titles
function getExamDates(sheetsApi: googleapis.sheets_v4.Sheets, spreadsheetId: string): Promise<string[]> {
    return sheetsApi.spreadsheets
        .get({spreadsheetId})
        .then(res => res.data.sheets)
        .then(sheets => sheets!.map(sheet => `${sheet.properties!.title}!A2:G`))
}

// Get spreadsheet ID from file
function getSpreadsheetId(): string {
    if (!fs.existsSync(spreadsheetdIdPath)) {
        throw new Error(`SpreadsheetId.json not found in ../data/ directory`);
    }
    return JSON.parse(fs.readFileSync(spreadsheetdIdPath).toString()).spreadsheetId;
}

// Returns array of examInfo for this date
function getExamListForDate(ranges: string[], sheets: googleapis.sheets_v4.Sheets, authClient: OAuth2Client): Promise<((ExamInfo)[])[]> {
    const request = {
        spreadsheetId: getSpreadsheetId(),
        ranges: ranges,
        auth: authClient,
    };

    return sheets.spreadsheets.values.batchGet(request)
        .then(response => {
            const data = response.data;

            if (!data.valueRanges) {
                return [[]]
            }

            return data.valueRanges.map((currRangeRes: Schema$ValueRange) => {
                if (!currRangeRes.range) {
                    return []
                }
                const currRange = currRangeRes.range.substring(0, 6)
                const rows = currRangeRes.values
                if (!rows || rows.length === 0) {
                    return [];
                }
                return rows
                    .filter(row => row.length < 5 || row.includes(undefined))
                    .map((row: any) => {
                        let lecturersArray = row[2].split(",");
                        lecturersArray = lecturersArray.map((lecturer: string) => {
                            return lecturer.split(".").join(" ").split("  ").join(" ").trim();
                        });
                        let groupsArray = row[3].split(",");
                        groupsArray = groupsArray.map((group: string) => {
                            return group.trim();
                        })
                        let examInfo: ExamInfo = {
                            date: currRange,
                            time: row[0],
                            subject: row[1],
                            lecturers: lecturersArray,
                            groups: groupsArray,
                            university: row[4]
                        }
                        return examInfo;
                });
            })
        })


}

// Returns array of all exams
export async function getExamList(auth: OAuth2Client | null): Promise<ExamInfo[]> {
    if (!auth) return []
    const sheets = google.sheets({version: 'v4', auth})
    return getExamDates(sheets, getSpreadsheetId())
        .then((ranges: string[]) => getExamListForDate(ranges, sheets, auth))
        .then((result: ((ExamInfo | undefined)[])[]) => {
            return result.flat().filter((exam) => exam != undefined) as ExamInfo[]
        })
}
