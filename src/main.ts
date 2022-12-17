import {authorize} from "./google-auth";
import {ExamInfo} from "./interfaces/ExamInfo";
import filters from "./filters";
import {getExamList} from "./parser";
import {Command} from 'commander'


function main() {
    //authAndGetData("euni", "რურუა", "წრედები")
    //return;
    const program = new Command();
    program
        .option('-l, --lecturer <string>')
        .option('-s, --subject <string>')
        .option('-u, --university <string>')
        .action((options) => {
            authAndGetData(options.university, options.lecturer, options.subject)
        })
    program.parse()
}

function sumSimilarExamsMatchScore(filteredExams: ExamInfo[]) {
    for (let i = 0; i < filteredExams.length; i++) {
        for (let j = i + 1; j < filteredExams.length; j++) {
            if (filteredExams[i].matchScore != 0 && filteredExams[j].matchScore != 0) {
                let exam1: ExamInfo = structuredClone(filteredExams[i]);
                let exam2: ExamInfo = structuredClone(filteredExams[j]);
                exam1.matchScore = 0;
                exam2.matchScore = 0;
                if (JSON.stringify(exam1) == JSON.stringify(exam2)) {
                    filteredExams[i].matchScore += filteredExams[j].matchScore
                    filteredExams[j].matchScore = 0
                }
            }
        }
    }
    filteredExams = filteredExams.filter((exam: ExamInfo) => exam.matchScore > 0)
    return filteredExams;
}

function filterExams(examsList : ExamInfo[],university: string | undefined, lecturer: string | undefined,
                     subject: string | undefined){
    let filteredExams: ExamInfo[] = [];

    if (subject !== undefined) {
        let copyForBySubject = structuredClone(examsList)
        let filteredExamsBySubject = filters.bySubject(copyForBySubject, subject)
        filteredExams.push(...filteredExamsBySubject)
    }
    if (lecturer !== undefined) {
        let copyForByLecturer = structuredClone(examsList)
        let filteredExamsByLecturer = filters.byLecturer(copyForByLecturer, lecturer)
        filteredExams.push(...filteredExamsByLecturer)
    }

    filteredExams = sumSimilarExamsMatchScore(filteredExams)

    if (university !== undefined) {
        filteredExams = filters.byUniversity(filteredExams, university)
    }

    filteredExams.sort((a, b) => b.matchScore - a.matchScore);

    //console.log(filteredExams)
    return filteredExams;
}

function authAndGetData(university: string | undefined, lecturer: string | undefined,
                     subject: string | undefined) {
    authorize()
        .then((auth: any) => getExamList(auth))
        .then((examsList: ExamInfo[]) => {
            console.log(filterExams(examsList, university, lecturer, subject))
        })
        .catch(console.error);
}

if (require.main === module) {
    main();
}
