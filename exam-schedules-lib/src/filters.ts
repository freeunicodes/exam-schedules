import {ExamInfo} from "./interfaces/ExamInfo";

import {Searcher} from "fast-fuzzy";

const searchOptions = {
    threshold: .7,
    returnMatchData: true
}

interface MatchScoreAndExam {
    searchExam: ExamInfo,
    searchScore: number
}

function mapAndFilterExamsList(mapFn: any, filterFn: any, examsList: ExamInfo[], searchString: string): MatchScoreAndExam[] {
    let mappedList: string[] = examsList.map(mapFn).flat() as string[];

    mappedList = [...new Set(mappedList)]
    const searcher = new Searcher(mappedList);
    const searchResults = searcher.search(searchString, searchOptions)

    return searchResults.map((searchResult: any) => {
        return examsList.filter((exam: ExamInfo) => {
            return filterFn(exam, searchResult.item)
        }).map((exam: ExamInfo) => {
            return {
                searchExam: exam,
                searchScore: searchResult.score
            }
        })
    }).flat();
}

function byLecturer(examsList: ExamInfo[], lecturer: string): MatchScoreAndExam[] {
    return mapAndFilterExamsList(
        (x: ExamInfo) => x.lecturers,
        (x: ExamInfo, searchResult: string) => x.lecturers.includes(searchResult),
        examsList, lecturer);
}

function bySubject(examsList: ExamInfo[], subject: string): MatchScoreAndExam[] {
    return mapAndFilterExamsList(
        (x: ExamInfo) => x.subject,
        (x: ExamInfo, searchResult: string) => x.subject === searchResult,
        examsList, subject);
}

function byUniversity(examsList: ExamInfo[], university: string): MatchScoreAndExam[] {
    return mapAndFilterExamsList(
        (x: ExamInfo) => x.university,
        (x: ExamInfo, searchResult: string) => x.university === searchResult,
        examsList, university);
}

function sumSimilarExamsMatchScore(filteredExams: MatchScoreAndExam[]): MatchScoreAndExam[] {
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
                     subject: string | undefined): ExamInfo[] {
    let filteredExams: MatchScoreAndExam[] = [];

    if (subject !== undefined) {
        const filteredExamsBySubject = bySubject(examsList, subject)
        filteredExams.push(...filteredExamsBySubject)
    }
    if (lecturer !== undefined) {
        const filteredExamsByLecturer = byLecturer(examsList, lecturer)
        filteredExams.push(...filteredExamsByLecturer)
    }

    filteredExams = sumSimilarExamsMatchScore(filteredExams)
    filteredExams.sort((a: MatchScoreAndExam, b: MatchScoreAndExam) => b.searchScore - a.searchScore)
    let result: ExamInfo[] = filteredExams.map((exam: MatchScoreAndExam) => exam.searchExam)

    if (university !== undefined) {
        let filteredExamsByUniversity = byUniversity(result, university).map((exam: MatchScoreAndExam) => exam.searchExam)
        result = result.filter((exam: ExamInfo) => filteredExamsByUniversity.includes(exam))
    }

    return result;
}

export default {
    byLecturer: byLecturer,
    bySubject: bySubject,
    byUniversity: byUniversity,
    filterExams: filterExams
}
