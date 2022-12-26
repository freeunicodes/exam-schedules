const {google} = require('googleapis');
const fs = require("fs");
import {ExamInfo} from "./interfaces/ExamInfo";

const spreadsheetdIdPath = "../data/SpreadsheetId.json"

//return array of Spreadsheets' titles
const getExamDates = async (sheets: any, spreadsheetId: any) => {
    let result = (await sheets.spreadsheets.get({
        spreadsheetId
    })).data.sheets;
    result = result.map((sheet: any) => {
        return `${sheet.properties.title}!A2:G`
    })
    return result;
}

// Get spreadsheet ID from file
function getSpreadsheetId(): string {
    if (!fs.existsSync(spreadsheetdIdPath)) {
        throw new Error(`SpreadsheetId.json not found in ../data/ directory`);
    }
    return JSON.parse(fs.readFileSync(spreadsheetdIdPath).toString()).spreadsheetId;
}

// Returns array of examInfo for this date
async function getExamListForDate(ranges: string[], sheets: any, authClient: any) {
    const request = {
        spreadsheetId: getSpreadsheetId(),
        ranges: ranges,
        auth: authClient,
    };

    try {
        const response = (await sheets.spreadsheets.values.batchGet(request)).data;
        return response.valueRanges.map((currRangeRes: any) => {
            const currRange = currRangeRes.range.substring(0, 6)
            const rows = currRangeRes.values
            if (!rows || rows.length === 0) {
                return undefined;
            }
            return rows.map((row: any) => {
                if (row.length < 5 || row.includes(undefined)) return undefined;
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
    } catch (err: any) {
        throw new Error(err!.title)
    }
}

// Returns array of all exams
export async function getExamList(auth: any) {
    const sheets = google.sheets({version: 'v4', auth})
    const ranges: string[] = await getExamDates(sheets, getSpreadsheetId())
    const promises = await getExamListForDate(ranges, sheets, auth)
    let result = (await Promise.all(promises)).flat()
    return result.filter((exam: any) => exam != undefined);
}
