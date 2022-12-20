import {expect} from 'chai'
import {ExamInfo} from "../src/interfaces/ExamInfo";
import filters from "../src/filters";

describe(`filtering exams`, () => {
    const examInfo: ExamInfo = {
        date: '29/10',
        time: '16:30-17:00',
        subject: 'შესავალი ციფრულ ტექნოლოგიებში',
        lecturers: ['ია მღვდლიაშვილი'],
        groups: ['22-03-01', '22-03-02', '22-08-01', '20-04-01'],
        university: 'Freeuni'
    }

    const examInfoSignature: ExamInfo = {
        date: '03/11',
        time: '13:30-15:30',
        subject: 'ფიზიკა',
        lecturers: ['ზ ოსმანოვი'],
        groups: ['20-06-01'],
        university: 'Freeuni'
    }

    function testFilterFunction(filterFn : any, examInfo: any, searchString: string, shouldInclude: boolean){
        if(shouldInclude)
            expect(filterFn([examInfo], searchString).map((exam:any) => exam.searchExam)).to.include(examInfo)
        else
            expect(filterFn([examInfo], searchString).map((exam:any) => exam.searchExam)).to.not.include(examInfo)
    }

    describe(`byLecturer should find exam by lecturer name`, () => {
        it(`full name in search query, full name in schedule`, () => {
            testFilterFunction(filters.byLecturer,examInfo,"ია მღვდლიაშვილი",true)
        })
        it(`signature in search query, full name in schedule`, () => {
            testFilterFunction(filters.byLecturer,examInfo, "ი. მღვდლიაშვილი",true)
        })
        it(`full name in search query, signature in schedule`, () => {
            testFilterFunction(filters.byLecturer, examInfoSignature, "ზაზა ოსმანოვი", true)
        })
        it(`signature in search query, signature in schedule`, () => {
            testFilterFunction(filters.byLecturer, examInfoSignature, "ზ. ოსმანოვი", true)
        })
        it(`first name in search query, full name in schedule`, () => {
            testFilterFunction(filters.byLecturer, examInfo, "ია", true)
        })
        it(`substring in search query, full name in schedule`, () => {
            testFilterFunction(filters.byLecturer, examInfo, "მღვდლ", true)
        })
        it(`substring in search query, signature in schedule`, () => {
            testFilterFunction(filters.byLecturer, examInfoSignature, "ოსმა", true)
        })
        it(`wrong name in search query, full name in schedule`, () => {
            testFilterFunction(filters.byLecturer, examInfo, "ნიკა", false)
        })
        it(`wrong name in search query, signature in schedule`, () => {
            testFilterFunction(filters.byLecturer,examInfoSignature,"ნიკა",false)
        })
    })

    describe(`bySubject should find exam by subject name`, () => {
        it(`full name in search query`, () => {
            testFilterFunction(filters.bySubject, examInfo, "შესავალი ციფრულ ტექნოლოგიებში", true)
        })
        it(`single word in search query`, () => {
            testFilterFunction(filters.bySubject, examInfo, "შესავალი", true)
        })
        it(`typo in search query`, () => {
            testFilterFunction(filters.bySubject, examInfo, "შესქვსალი ცფრულ ტექოლოგიბში", true)
        })
        it(`substring in search query`, () => {
            testFilterFunction(filters.bySubject, examInfo, "ციფრ", true)
        })
        it(`typo in substring in search query`, () => {
            testFilterFunction(filters.bySubject, examInfo, "ტეხნოლოგიები", true)
        })
        it(`other subject name in search query`, () => {
            testFilterFunction(filters.bySubject, examInfo, "კალკულუსი", false)
        })
    })

    describe(`byUniversity should find exam by university name`, () => {
        it(`full university name in search query`, () => {
            testFilterFunction(filters.byUniversity, examInfo, "Freeuni", true)
        })
        it(`typo in search query`, () => {
            testFilterFunction(filters.byUniversity, examInfo, "freeumi", true)
        })
        it(`substring in search query`, () => {
            testFilterFunction(filters.byUniversity, examInfo, "fre", true)
        })
        it(`other university name in search query`, () => {
            testFilterFunction(filters.byUniversity, examInfo, "Agruni", false)
        })
    })
})