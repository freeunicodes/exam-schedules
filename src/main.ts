import {authorize} from "./google-auth";
import {ExamInfo} from "./interfaces/ExamInfo";
import filters from "./filters";
import {getExamList} from "./parser";
import {Command} from 'commander'

const searchOptions = {
    threshold : .8,
}


function main() {
    filterExams("Freeuni", "ი. მღვლიაშვილი", "შესავალი", undefined)
    return ;
    const program = new Command();
    program
        .option('-l, --lecturer <string>')
        .option('-s, --subject <string>')
        .option('-g, --group <string>')
        .option('-u, --university <string>')
        .action((options) => {
            filterExams(options.university, options.lecturer, options.subject, options.group)
        })
    program.parse()
}

function filterExams(university: string | undefined, lecturer: string | undefined,
                     subject: string | undefined, group: string | undefined) {
    authorize()
        .then((auth: any) => getExamList(auth))
        .then((filteredExams: ExamInfo[]) => {
            if (subject !== undefined) {
                filteredExams = filters.bySubject(filteredExams, subject, searchOptions)
            }
            if (lecturer !== undefined) {
                filteredExams = filters.byLecturer(filteredExams, lecturer, searchOptions)
            }
            if (group !== undefined) {
                filteredExams = filters.byGroup(filteredExams, group, searchOptions)
            }
            if (university !== undefined) {
                filteredExams = filters.byUniversity(filteredExams, university, searchOptions)
            }
            console.log(filteredExams)
        })
        .catch(console.error);
}

if (require.main === module) {
    main();
}
