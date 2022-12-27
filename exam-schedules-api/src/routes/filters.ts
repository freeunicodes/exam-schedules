import filters from 'exam-schedules-lib/src/filters'
import {getCachedState} from './index'
import express, {Request, Response} from 'express';

export const filterRouter = express.Router();

filterRouter.get('/lecturer/:searchString', function (req: Request, res: Response) {
    const searchString = req.params.searchString
    res.send({
        lastFetchTime: getCachedState().lastFetchTime,
        examsList: filters.byLecturer(getCachedState().examsList, searchString)
    })
})

filterRouter.get('/subject/:searchString', function (req: Request, res: Response) {
    const searchString = req.params.searchString
    res.send({
        lastFetchTime: getCachedState().lastFetchTime,
        examsList: filters.bySubject(getCachedState().examsList, searchString)
    })
})

filterRouter.get('/university/:searchString', function (req: Request, res: Response) {
    const searchString = req.params.searchString
    res.send({
        lastFetchTime: getCachedState().lastFetchTime,
        examsList: filters.byUniversity(getCachedState().examsList, searchString)
    })
})

filterRouter.get('/', function (req: Request, res: Response) {
    const searchStringLecturer = req.query.lecturer as string | undefined
    const searchStringSubject = req.query.subject as string | undefined
    const searchStringUniversity = req.query.university as string | undefined

    res.send({
        lastFetchTime: getCachedState().lastFetchTime,
        examsList: filters.filterExams(getCachedState().examsList, searchStringUniversity, searchStringLecturer, searchStringSubject)
    })
})

