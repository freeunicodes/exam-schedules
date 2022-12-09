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

    describe(`byLecturer should find lecture by name`, () => {
        it(`full name in search query, full name in schedule`, () => {
            expect(filters.byLecturer([examInfo], "ია მღვდლიაშვილი")).to.include(examInfo);
        })
        it(`name initial in search query, full name in schedule`, () => {
            expect(filters.byLecturer([examInfo], "ი. მღვდლიაშვილი")).to.include(examInfo);
        })
        it(`full name in search query, name initial in schedule`, () => {
            expect(filters.byLecturer([examInfoSignature], "ია მღვდლიაშვილი")).to.include(examInfoSignature);
        })
        it(`name initial in search query, name initial in schedule`, () => {
            expect(filters.byLecturer([examInfoSignature], "ი. მღვდლიაშვილი")).to.include(examInfoSignature);
        })
    })

})