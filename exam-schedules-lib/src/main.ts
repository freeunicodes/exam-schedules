import {authorize} from "./google-auth";
import {ExamInfo} from "./interfaces/ExamInfo";
import filters from "./filters";
import {getExamList} from "./parser";
import {Command} from 'commander'

function main() {
    //authAndGetFilteredData("freeuni", "რურუა", "წრედები")
    //return;
    const program = new Command();
    program
        .option('-l, --lecturer <string>')
        .option('-s, --subject <string>')
        .option('-u, --university <string>')
        .action((options) => {
            authAndGetFilteredData(options.university, options.lecturer, options.subject)
        })
    program.parse()
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
        let filteredExamsBySubject = filters.bySubject(examsList, subject)
        filteredExams.push(...filteredExamsBySubject)
    }
    if (lecturer !== undefined) {
        let filteredExamsByLecturer = filters.byLecturer(examsList, lecturer)
        filteredExams.push(...filteredExamsByLecturer)
    }

    filteredExams = sumSimilarExamsMatchScore(filteredExams)
    filteredExams.sort((a: any, b: any) => b.searchScore - a.searchScore)
    filteredExams = filteredExams.map((exam: any) => exam.searchExam)

    if (university !== undefined) {
        let filteredExamsByUniversity = filters.byUniversity(filteredExams, university).map((exam: any) => exam.searchExam)
        filteredExams = filteredExams.filter((exam: ExamInfo) => filteredExamsByUniversity.includes(exam))
    }

    return filteredExams;
}

function authAndGetFilteredData(university: string | undefined, lecturer: string | undefined,
                        subject: string | undefined) {
    authorize()
        .then((auth: any) => getExamList(auth))
        .then((examsList: ExamInfo[]) => {
            console.log(filterExams(examsList, university, lecturer, subject))
        })
        .catch(console.error);
}

export async function authAndGetData() {
     return authorize()
        .then((auth: any) => getExamList(auth))
        .then((examsList: ExamInfo[]) => {
            return examsList;
        })
        .catch(console.error);
}


if (require.main === module) {
    main();
}
