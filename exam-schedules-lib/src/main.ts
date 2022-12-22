import {authorize} from "./google-auth";
import {ExamInfo} from "./interfaces/ExamInfo";
import filters from "./filters";
import {getExamList} from "./parser";
import {Command} from 'commander'

function main() {
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


function authAndGetFilteredData(university: string | undefined, lecturer: string | undefined,
                                subject: string | undefined) {
    authAndGetData().then((examsList: ExamInfo[] | void) => {
        console.log(filters.filterExams(examsList!, university, lecturer, subject))
    })
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
