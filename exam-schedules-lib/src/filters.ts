import {ExamInfo} from "./interfaces/ExamInfo";

const {Searcher} = require("fast-fuzzy");

const searchOptions = {
    threshold: .7,
    returnMatchData: true
}

function mapAndFilterExamsList(mapFn: any, filterFn: any, examsList: any, searchString: string) {
    let mappedList = examsList.map(mapFn).flat();

    mappedList = [...new Set(mappedList)]
    const searcher = new Searcher(mappedList);
    const searchResults = searcher.search(searchString, searchOptions)


    const searches =  searchResults.map((searchResult: any) => {
        return examsList.filter((exam: any) => {
            return filterFn(exam, searchResult.item)
        }).map((exam: ExamInfo) =>{
            return {
                searchExam: exam,
                searchScore: searchResult.score
            }
        })
    }).flat();
    return searches;
}

function byLecturer(examsList: ExamInfo[], lecturer: string) {
    return mapAndFilterExamsList(
        (x: any) => x.lecturers,
        (x: any, searchResult: any) => x.lecturers.includes(searchResult),
        examsList, lecturer);
}

function bySubject(examsList: ExamInfo[], subject: string) {
    return mapAndFilterExamsList(
        (x: any) => x.subject,
        (x: any, searchResult: any) => x.subject === searchResult,
        examsList, subject);
}

function byUniversity(examsList: ExamInfo[], university: string) {
    return mapAndFilterExamsList(
        (x: any) => x.university,
        (x: any, searchResult: any) => x.university === searchResult,
        examsList, university);
}

function sumSimilarExamsMatchScore(filteredExams: any[]) {
    for (let i = 0; i < filteredExams.length; i++) {
        for (let j = i + 1; j < filteredExams.length; j++) {
            if (filteredExams[i].searchScore != 0 && filteredExams[j].searchScore != 0) {
                if (JSON.stringify(filteredExams[i].searchExam) === JSON.stringify(filteredExams[j].searchExam)) {
                    filteredExams[i].searchScore += filteredExams[j].searchScore
                    filteredExams[j].searchScore = 0
                }
            }
        }
    }
    filteredExams = filteredExams.filter((exam: any) => exam.searchScore > 0)
    return filteredExams;
}

function filterExams(examsList: ExamInfo[], university: string | undefined, lecturer: string | undefined,
                     subject: string | undefined) {
    let filteredExams: any = [];

    if (subject !== undefined) {
        let filteredExamsBySubject = bySubject(examsList, subject)
        filteredExams.push(...filteredExamsBySubject)
    }
    if (lecturer !== undefined) {
        let filteredExamsByLecturer = byLecturer(examsList, lecturer)
        filteredExams.push(...filteredExamsByLecturer)
    }

    filteredExams = sumSimilarExamsMatchScore(filteredExams)
    filteredExams.sort((a: any, b: any) => b.searchScore - a.searchScore)
    filteredExams = filteredExams.map((exam: any) => exam.searchExam)

    if (university !== undefined) {
        let filteredExamsByUniversity = byUniversity(filteredExams, university).map((exam: any) => exam.searchExam)
        filteredExams = filteredExams.filter((exam: ExamInfo) => filteredExamsByUniversity.includes(exam))
    }

    return filteredExams;
}

export default {
    byLecturer: byLecturer,
    bySubject: bySubject,
    byUniversity: byUniversity,
    filterExams: filterExams
}
