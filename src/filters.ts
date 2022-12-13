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
    let searchResults = searcher.search(searchString, searchOptions)

    return searchResults.map((searchResult: any) => {
        return examsList.filter((exam: any) => {
            let isOkayExam = filterFn(exam, searchResult.item);
            if (isOkayExam) {
                exam.matchScore += searchResult.score;
            }
            return isOkayExam
        })
    }).flat();
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

export default {
    byLecturer: byLecturer,
    bySubject: bySubject,
    byUniversity: byUniversity
}
