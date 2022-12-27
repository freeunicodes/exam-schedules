import filters from 'exam-schedules-lib/src/filters'
import {getCachedState} from './index'
import express from 'express';

export const filterRouter = express.Router();

filterRouter.get('/lecturer/:searchString', function (req: any, res: any) {
    const searchString = req.params.searchString
    res.send({
        lastFetchTime: getCachedState().lastFetchTime,
        examsList: filters.byLecturer(getCachedState().examsList, searchString)
    })
})

filterRouter.get('/subject/:searchString', function (req: any, res: any) {
    const searchString = req.params.searchString
    res.send({
        lastFetchTime: getCachedState().lastFetchTime,
        examsList: filters.bySubject(getCachedState().examsList, searchString)
    })
})

filterRouter.get('/university/:searchString', function (req: any, res: any) {
    const searchString = req.params.searchString
    res.send({
        lastFetchTime: getCachedState().lastFetchTime,
        examsList: filters.byUniversity(getCachedState().examsList, searchString)
    })
})

filterRouter.get('/', function (req: any, res: any) {
    const searchStringLecturer = req.query.lecturer
    const searchStringSubject = req.query.subject
    const searchStringUniversity = req.query.university

    res.send({
        lastFetchTime: getCachedState().lastFetchTime,
        examsList: filters.filterExams(getCachedState().examsList, searchStringUniversity, searchStringLecturer, searchStringSubject)
    })
})

