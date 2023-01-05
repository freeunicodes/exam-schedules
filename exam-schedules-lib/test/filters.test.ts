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

    const zazasPhysicsExam: ExamInfo = {
        date: '03/11',
        time: '13:30-15:30',
        subject: 'ფიზიკა',
        lecturers: ['ზაზა ოსმანოვი'],
        groups: ['20-06-01'],
        university: 'Freeuni'
    }

    const vazhasPhysicsExam: ExamInfo = {
        date: "'18/11",
        time: "14:40-15:40",
        subject: "ბუნებისმეტყველება-ფიზიკა",
        lecturers: ["ვაჟა ბერეჟიანი"],
        groups: ["22-06-01", "22-06-02", "22-08-01", "22-09-01", "22-10-04"],
        university: "Freeuni"
    }

    describe(`Main filter function with three criterion`, () => {
        it(`filtering only by lecturer`, () => {
            const filteredList: ExamInfo[] = filters.filterExams([examInfo], undefined, "ია მღვდლიაშვილი", undefined)
            expect(filteredList).to.include(examInfo)
        })

        it(`filtering only by lecturer and university`, () => {
            const filteredList: ExamInfo[] = filters.filterExams([examInfo], "freeuni", "ია მღვდლიაშვილი", undefined)
            expect(filteredList).to.include(examInfo)
        })

        it(`filtering by lecturer and wrong university should be  empty`, () => {
            const filteredList: ExamInfo[] = filters.filterExams([examInfo], "Agruni", "ია მღვდლიაშვილი", undefined)
            expect(filteredList).to.not.include(examInfo)
        })

        it(`filtering by lecturer and similar subject`, () => {
            const filteredList: ExamInfo[] = filters.filterExams([examInfo], undefined, "ია მღვდლიაშვილი", "ციფრული ტექნოლოგიები")
            expect(filteredList).to.include(examInfo)
        })

        it(`filtering only by subject`, () => {
            const filteredList: ExamInfo[] = filters.filterExams([examInfo], undefined, undefined, "შესავალი ციფრულ ტექნოლოგიებში")
            expect(filteredList).to.include(examInfo)
        })

        it(`filtering only by similar subject`, () => {
            const filteredList: ExamInfo[] = filters.filterExams([examInfo], undefined, undefined, "ციფრული ტექნოლოგიები")
            expect(filteredList).to.include(examInfo)
        })

        it(`filtering by wrong subject and correct university should be empty`, () => {
            const filteredList: ExamInfo[] = filters.filterExams([examInfo], "Freeuni", undefined, "ქიმია")
            expect(filteredList).to.not.include(examInfo)
        })

        it(`filtering only by university should be empty`, () => {
            const filteredList: ExamInfo[] = filters.filterExams([examInfo], "Freeuni", undefined, undefined)
            expect(filteredList).to.not.include(examInfo)
        })

        it(`check filtered list order`, () => {
            const filteredList: ExamInfo[] = filters.filterExams([vazhasPhysicsExam, zazasPhysicsExam], "Freeuni", "ზაზა ოსმანოვი", "ფიზიკა")
            const indexOfVazhasExam = filteredList.indexOf(vazhasPhysicsExam)
            const indexOfZazasExam = filteredList.indexOf(zazasPhysicsExam)
            expect(indexOfZazasExam).to.lessThan(indexOfVazhasExam)
        })
    })


    function testFilterFunction(filterFn: any, examInfo: ExamInfo, searchString: string, shouldInclude: boolean) {
        if (shouldInclude)
            return expect(filterFn([examInfo], searchString).map((exam: any) => exam.searchExam)).to.include(examInfo)
        else
            return expect(filterFn([examInfo], searchString).map((exam: any) => exam.searchExam)).to.not.include(examInfo)
    }

    describe(`byLecturer should find exam by lecturer name`, () => {
        it(`full name in search query, full name in schedule`, () => {
            testFilterFunction(filters.byLecturer, examInfo, "ია მღვდლიაშვილი", true)
        })
        it(`signature in search query, full name in schedule`, () => {
            testFilterFunction(filters.byLecturer, examInfo, "ი. მღვდლიაშვილი", true)
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
            testFilterFunction(filters.byLecturer, examInfoSignature, "ნიკა", false)
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