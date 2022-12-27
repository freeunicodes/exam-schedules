import {authAndGetData, ExamInfo} from "exam-schedules-lib";

import express, {NextFunction, Request, Response} from 'express';

export const indexRouter = express.Router();

const delay = (2 * 60 * 1000);

interface State {
    lastFetchTime?: number
    examsList: ExamInfo[]
}

let fetchInfo: State = {
    lastFetchTime: undefined,
    examsList: []
}

export function getCachedState(): State {
    return fetchInfo;
}

indexRouter.use((req: Request, res: Response, next: NextFunction) => {
    if (fetchInfo.lastFetchTime === undefined || (Date.now() - fetchInfo.lastFetchTime) > delay) {
        console.log("Now fetching")
        authAndGetData()
            .then((response: ExamInfo[]) => {
                fetchInfo.examsList = response
                fetchInfo.lastFetchTime = Date.now()
                next()
            });
    } else {
        next()
    }
})

indexRouter.get('/', function (req: Request, res: Response) {
    res.send(fetchInfo);
})

