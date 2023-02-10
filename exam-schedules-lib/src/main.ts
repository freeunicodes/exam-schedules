import {authorize} from "./google-auth";
import {ExamInfo} from "./interfaces/ExamInfo";
import filters from "./filters";
import {getExamList} from "./parser";
import {Command} from 'commander'
import createLogger from "logging";

export {ExamInfo} from "./interfaces/ExamInfo";
const logger = createLogger(__filename);

function main() {
    const program = new Command();
    program
        .option('-l, --lecturer <string>')
        .option('-s, --subject <string>')
        .option('-u, --university <string>')
        .action((options) => {
            authAndGetFilteredData(options.university, options.lecturer, options.subject)
                .then((result: ExamInfo[]) => console.log(result))
                .catch((err: Error) => {
                    logger.error(err)
                    process.exit(1)
                })
        })
    program.parse()
}


async function authAndGetFilteredData(university: string | undefined, lecturer: string | undefined,
                                subject: string | undefined): Promise<ExamInfo[]> {
    const data = await authAndGetData()
    return filters.filterExams(data, university, lecturer, subject)
}

export async function authAndGetData(): Promise<ExamInfo[]> {
    const auth = authorize();
    return await getExamList(auth)
}

if (require.main === module) {
    main();
}
