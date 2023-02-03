import {expect} from 'chai'
import {ExamInfo} from "../src/interfaces/ExamInfo";
import {
    createExamInfoFromRow,
    createExamInfosFromSheet,
    getExamListForValueRanges,
    getRowsFromSheet,
    hasMissingValues
} from "../src/parser";
import fs from "fs";
import {sheets_v4} from "googleapis";
import deepEqualInAnyOrder from 'deep-equal-in-any-order'
import Schema$ValueRange = sheets_v4.Schema$ValueRange;
import chai from 'chai'

chai.use(deepEqualInAnyOrder)

describe(`integration tests`, () => {
    const valueRanges: Schema$ValueRange[] = JSON.parse(fs.readFileSync('test/multiple_sheets.json', 'utf-8'))
    const exams: ExamInfo[] = JSON.parse(fs.readFileSync('test/getExamListForValueRanges_result.json', 'utf-8'))
    it('check getExamListForValueRanges result to be valid ExamInfo[]', () => {
        const result = getExamListForValueRanges(valueRanges);
        expect(result).to.be.deep.equal(exams);
    })
    it('check corrupted getExamListForValueRanges result to be invalid ExamInfo[]', () => {
        const result = getExamListForValueRanges(valueRanges);
        exams[0].subject = "error"
        expect(result).to.not.be.deep.equal(exams);
    })
})

describe(`unit tests`, () => {
    const valueRange: Schema$ValueRange = JSON.parse(fs.readFileSync('test/single_sheet.json', 'utf-8'))
    const exams: ExamInfo[] = JSON.parse(fs.readFileSync('test/createExamInfoFromSheet_result.json', 'utf-8'))
    const completeRow = [
        "11:10-11:50",
        "ფსიქოლოგია",
        "მარიამ ყაჭეიშვილი, ა.  გაბესკირია",
        "20-03-01,20-03-02,20-04-01,20-05-01",
        "Freeuni",
        "110",
        "110"
    ]
    const incompleteRow = [
        "11:10-11:50",
        "ფსიქოლოგია",
        "მარიამ ყაჭეიშვილი, ანკა გაბესკირია",
        ""
    ]
    it(`createExamInfosFromSheet`, () => {
        const result = createExamInfosFromSheet(valueRange);
        expect(result).to.be.deep.equal(exams);
    })
    it(`getRowsFromSheet`, () => {
        const exams: ExamInfo[] = JSON.parse(fs.readFileSync('test/getRowsFromSheet_result.json', 'utf-8'))
        const result = getRowsFromSheet(valueRange)
        expect(result).to.be.deep.equal(exams);
    })
    it(`hasMissingValues false return value`, () => {
        const result = hasMissingValues(completeRow)
        expect(result).to.be.false
    })
    it(`hasMissingValues true return value`, () => {
        const result = hasMissingValues(incompleteRow)
        expect(result).to.be.true
    })
    it(`createExamInfoFromRow`, () => {
        const result = createExamInfoFromRow(completeRow, "18/10");
        const exam: ExamInfo = {
            groups: ["20-03-01", "20-03-02", "20-04-01", "20-05-01"],
            lecturers: ["მარიამ ყაჭეიშვილი", "ა გაბესკირია"],
            subject: "ფსიქოლოგია",
            university: "Freeuni",
            date: "18/10",
            time: "11:10-11:50"
        }
        expect(result).to.be.deep.equal(exam)
    })
})
