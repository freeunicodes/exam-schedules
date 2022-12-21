import filters from 'exam-schedules-lib/src/filters'
import indexRouter from './index'

const express = require('express');
const router = express.Router();

router.get('/lecturer/:searchString', function (req: any, res: any) {
    const searchString = req.params.searchString
    res.send({
        lastFetchTime: indexRouter.getCachedState().lastFetchTime,
        examsList: filters.byLecturer(indexRouter.getCachedState().examsList, searchString)
    })
})

router.get('/subject/:searchString', function (req: any, res: any) {
    const searchString = req.params.searchString
    res.send({
        lastFetchTime: indexRouter.getCachedState().lastFetchTime,
        examsList: filters.bySubject(indexRouter.getCachedState().examsList, searchString)
    })
})

router.get('/university/:searchString', function (req: any, res: any) {
    const searchString = req.params.searchString
    res.send({
        lastFetchTime: indexRouter.getCachedState().lastFetchTime,
        examsList: filters.byUniversity(indexRouter.getCachedState().examsList, searchString)
    })
})

router.get('/all', function (req: any, res: any) {
    // TODO
})


module.exports = router;
