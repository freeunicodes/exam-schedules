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

let nowFetching: boolean = false

indexRouter.use(async (req: Request, res: Response, next: NextFunction) => {
    // Wait if request is already being made
    await until(nowFetching)

    if (fetchInfo.lastFetchTime === undefined || (Date.now() - fetchInfo.lastFetchTime) > delay) {
        console.log("Now fetching");
        nowFetching = true;
        authAndGetData()
            .then((response: ExamInfo[]) => {
                fetchInfo.examsList = response
                fetchInfo.lastFetchTime = Date.now()
                next()
            })
            .catch(err => {
                next(err)
            })
            .finally(() => {
                nowFetching = false
            })
    } else {
        next()
    }
})


indexRouter.get('/', function (req: Request, res: Response) {
    res.send(fetchInfo);
})

function until(condition: boolean) {
    const poll = (resolve: (value?: {} | PromiseLike<{}>) => void) => {
        if (!condition) resolve();
        else setTimeout(_ => poll(resolve), 400);
    }

    return new Promise(poll);
}


