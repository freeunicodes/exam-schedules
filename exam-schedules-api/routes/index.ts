import {ExamInfo} from "exam-schedules-lib/src/interfaces/ExamInfo";

const express = require('express');
const {authAndGetData} = require('exam-schedules-lib');
const router = express.Router();

const delay = new Date(0, 0, 0, 0, 1);

interface State {
    lastFetchTime?: number
    examsList: ExamInfo[]
}

let fetchInfo: State = {
    lastFetchTime: undefined,
    examsList: []
}

function getCachedState(): State {
    return fetchInfo;
}

router.use((req: any, res: any, next: any) => {
    if (fetchInfo.lastFetchTime === undefined || (Date.now() - fetchInfo.lastFetchTime) > delay.getMilliseconds()) {
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

router.get('/', function (req: any, res: any) {
    res.send(fetchInfo);
})

export default {
    router: router,
    getCachedState: getCachedState
};
