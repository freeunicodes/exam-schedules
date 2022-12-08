import {expect} from 'chai'
import {ExamInfo} from "../src/interfaces/ExamInfo";
import filters from "../src/filters";

describe(`filtering exams`, () => {
    const examInfo: ExamInfo = {
        date: "",
        groups: [],
        subject: "",
        time: "",
        university: "",
        lecturers: ["ია მღვდლიაშვილი"]
    }

    const examInfoSignature: ExamInfo = {
        ...examInfo,
        lecturers: ["ი. მღვდლიაშვილი"]
    }

    describe(`byLecturer (ია მღვდლიაშვილი)`, () => {
        it(`should find lecture by lecturer's full name`, () => {
            expect(filters.byLecturer([examInfo], "ია მღვდლიაშვილი")).to.include(examInfo);
        })
        it(`should find lecture by lecturer's signature`, () => {
            expect(filters.byLecturer([examInfo], "ი. მღვდლიაშვილი")).to.include(examInfo);
        })
    })

    describe(`byLecturer (ი. მღვდლიაშვილი)`, () => {
        it(`should find lecture by lecturer's full name`, () => {
            expect(filters.byLecturer([examInfoSignature], "ია მღვდლიაშვილი")).to.include(examInfoSignature);
        })
        it(`should find lecture by lecturer's signature`, () => {
            expect(filters.byLecturer([examInfoSignature], "ი. მღვდლიაშვილი")).to.include(examInfoSignature);
        })
    })
})