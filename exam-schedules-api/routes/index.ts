// import {ExamInfo} from "exam-schedules-lib/src/interfaces/ExamInfo";

import {ExamInfo} from "exam-schedules-lib/src/interfaces/ExamInfo";

const express = require('express');
const {authAndGetData, filters} = require('exam-schedules-lib');
const router = express.Router();

const delay = new Date(0, 0, 0, 0, 5);

let lastFetchTime: number;
let examsList: ExamInfo[];

router.use((req: any, res: any, next: any) => {
    if (lastFetchTime === undefined || (Date.now() - lastFetchTime) > delay.getMilliseconds()) {
        console.log("Now fetching")
        authAndGetData().then((response : ExamInfo[]) => examsList = response);
        lastFetchTime = Date.now()
    }
    next()
})

router.get('/', function (req: any, res: any, next: any) {
    res.send({response: filters.byLecturer(examsList, "ია")});
})

module.exports = router;
