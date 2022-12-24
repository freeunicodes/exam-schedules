const {google} = require('googleapis');
const fs = require("fs");
import {ExamInfo} from "./interfaces/ExamInfo";

const fetchFullData = false

//return array of Spreadsheets' titles
const getExamDates = async (sheets: any, spreadsheetId: any) => {
    let result = (await sheets.spreadsheets.get({
        spreadsheetId
    })).data.sheets;
    result = result.map((sheet: any) => {
        return sheet.properties.title
    })
    // TODO
    if (!fetchFullData) result = result.slice(0, 10);
    return result;
}

// Get spreadsheet ID from file
function getSpreadsheetId(): string {
    let spreadsheetdIdPath = "../data/SpreadsheetId.json"
    if (!fs.existsSync(spreadsheetdIdPath)) {
        throw new Error(`SpreadsheetId.json not found in ../data/ directory`);
    }
    return JSON.parse(fs.readFileSync(spreadsheetdIdPath).toString()).spreadsheetId;
}

// Returns array of examInfo for this date
async function getExamListForDate(range: string, sheets: any) {
    // This should be other function
    const res = await sheets.spreadsheets.values.get({
        spreadsheetId: getSpreadsheetId(),
        range: `${range}!A2:G`,
    });
    const rows = res.data.values;

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
            date: range,
            time: row[0],
            subject: row[1],
            lecturers: lecturersArray,
            groups: groupsArray,
            university: row[4]
        }
        return examInfo;
    });
}

function sleep(delay: number) {
    let start = new Date().getTime();
    while (new Date().getTime() < start + delay) {}
}

// Returns array of all exams
export async function getExamList(auth: any) {
    const sheets = google.sheets({version: 'v4', auth})
    const ranges: string[] = await getExamDates(sheets, getSpreadsheetId())

    let rangeCnt = 0;
    const promises = ranges.map(range => {
        rangeCnt++;
        if (fetchFullData && rangeCnt % 50 == 0) sleep(60 * 1000)
        return getExamListForDate(range, sheets)
    })
    let result = (await Promise.all(promises)).flat()
    result = result.filter((exam: any) => exam != undefined);
    return result;
}
