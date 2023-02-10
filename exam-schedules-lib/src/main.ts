import {authorize} from "./google-auth";
import {ExamInfo} from "./interfaces/ExamInfo";
import {filters} from "./filters";
import {getExamList} from "./parser";
import {Command} from 'commander'
import {OAuth2Client} from "google-auth-library";

export {ExamInfo} from "./interfaces/ExamInfo";
export {filters} from './filters'

function main() {
    const program = new Command();
    program
        .option('-l, --lecturer <string>')
        .option('-s, --subject <string>')
        .option('-u, --university <string>')
        .action((options) => {
            authAndGetFilteredData(options.university, options.lecturer, options.subject)
                .then((result: ExamInfo[]) => console.log(result))
                .catch((err: Error) => console.log(err))
        })
    program.parse()
}


function authAndGetFilteredData(university: string | undefined, lecturer: string | undefined,
                                subject: string | undefined): Promise<ExamInfo[]> {
    return authAndGetData()
        .then((examsList: ExamInfo[] | void) => {
            return filters.filterExams(examsList!, university, lecturer, subject)
        })
}

export function authAndGetData(): Promise<ExamInfo[]> {
    return authorize()
        .then((auth: OAuth2Client) => getExamList(auth))
        .then((examsList: ExamInfo[]) => {
            return examsList;
        });
}


if (require.main === module) {
    main();
}
