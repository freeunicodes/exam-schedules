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

    //TODO
    describe(`byLecturer should find exam by lecturer name`, () => {
        it(`full name in search query, full name in schedule`, () => {
            testFilterFunction(filters.byLecturer,examInfo,"ია მღვდლიაშვილი",true)
            //expect(filters.byLecturer([examInfo], "")).to.include(examInfo);
        })
        it(`signature in search query, full name in schedule`, () => {
            expect(filters.byLecturer([examInfo], "ი. მღვდლიაშვილი")).to.include(examInfo);
        })
        it(`full name in search query, signature in schedule`, () => {
            expect(filters.byLecturer([examInfoSignature], "ზაზა ოსმანოვი")).to.include(examInfoSignature);
        })
        it(`signature in search query, signature in schedule`, () => {
            expect(filters.byLecturer([examInfoSignature], "ზ. ოსმანოვი")).to.include(examInfoSignature);
        })
        it(`first name in search query, full name in schedule`, () => {
            expect(filters.byLecturer([examInfo], "ია")).to.include(examInfo);
        })
        it(`substring in search query, full name in schedule`, () => {
            expect(filters.byLecturer([examInfo], "მღვდლ")).to.include(examInfo);
        })
        it(`substring in search query, signature in schedule`, () => {
            expect(filters.byLecturer([examInfoSignature], "ოსმა")).to.include(examInfoSignature);
        })
        it(`wrong name in search query, full name in schedule`, () => {
            expect(filters.byLecturer([examInfo], "ნიკა")).to.not.include(examInfo);
        })
        it(`wrong name in search query, signature in schedule`, () => {
            testFilterFunction(filters.byLecturer,examInfoSignature,"ნიკა",false)
            //expect(filters.byLecturer([examInfoSignature], "ნიკა")).to.not.include(examInfoSignature);
        })
    })

    describe(`bySubject should find exam by subject name`, () => {
        it(`full name in search query`, () => {
            expect(filters.bySubject([examInfo], "შესავალი ციფრულ ტექნოლოგიებში")).to.include(examInfo);
        })
        it(`single word in search query`, () => {
            expect(filters.bySubject([examInfo], "შესავალი")).to.include(examInfo);
        })
        it(`typo in search query`, () => {
            expect(filters.bySubject([examInfo], "შესქვსალი ცფრულ ტექოლოგიბში")).to.include(examInfo);
        })
        it(`substring in search query`, () => {
            expect(filters.bySubject([examInfo], "ციფრ")).to.include(examInfo);
        })
        it(`typo in substring in search query`, () => {
            expect(filters.bySubject([examInfo], "ტეხნოლოგიები")).to.include(examInfo);
        })
        it(`other subject name in search query`, () => {
            expect(filters.bySubject([examInfo], "კალკულუსი")).to.not.include(examInfo);
        })
    })

    describe(`byUniversity should find exam by university name`, () => {
        it(`full university name in search query`, () => {
            expect(filters.byUniversity([examInfo], "Freeuni")).to.include(examInfo);
        })
        it(`typo in search query`, () => {
            expect(filters.byUniversity([examInfo], "freeumi")).to.include(examInfo);
        })
        it(`substring in search query`, () => {
            expect(filters.byUniversity([examInfo], "fre")).to.include(examInfo);
        })
        it(`other university name in search query`, () => {
            expect(filters.byUniversity([examInfo], "Agruni")).to.not.include(examInfo);
        })
    })
})