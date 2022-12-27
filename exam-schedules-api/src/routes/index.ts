import {ExamInfo} from "exam-schedules-lib";

import express from 'express';
const {authAndGetData} = require('exam-schedules-lib');
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

indexRouter.use((req: any, res: any, next: any) => {
    if (fetchInfo.lastFetchTime === undefined || (Date.now() - fetchInfo.lastFetchTime) > delay) {
        console.log("Now fetching")
        authAndGetData().then((response: ExamInfo[]) => {
            fetchInfo.examsList = response
            fetchInfo.lastFetchTime = Date.now()
            next()
        });
    } else {
        next()
    }
})

indexRouter.get('/', function (req: any, res: any) {
    res.send(fetchInfo);
})

