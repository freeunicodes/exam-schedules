import chaiHttp from 'chai-http';
import app from '../src/app'
import {expect} from "chai";
import chai from 'chai'
import {ExamInfo} from 'exam-schedules-lib'

chai.use(chaiHttp)

describe('test ok (200) statuses', function () {
    it('/ should return 200', (done) => {
        expectStatus(chai.request(app).get('/'), 200, done)
    })
    it('/filters/ should return 200', (done) => {
        expectStatus(chai.request(app).get('/filters/'), 200, done);
    })
    it('/filters/lecturer/test should return 200', (done) => {
        expectStatus(chai.request(app).get('/filters/lecturer/test'), 200, done)
    })
    it('/filters/subject/test should return 200', (done) => {
        expectStatus(chai.request(app).get('/filters/subject/test'), 200, done)
    })
    it('/filters/university/test should return 200', (done) => {
        expectStatus(chai.request(app).get('/filters/university/test'), 200, done)
    })
});

describe('test response bodies', function () {
    it('/ should have lastFetchTime', (done) => {
        chai.request(app).get('/').end((err, res) => {
            expect(res.body).to.haveOwnProperty("lastFetchTime")
            done()
        })
    })
    it('/ should have examsList', (done) => {
        chai.request(app).get('/').end((err, res) => {
            expect(res.body).to.haveOwnProperty("examsList")
            done()
        })
    })
    it('/ should not be empty examsList', (done) => {
        chai.request(app).get('/').end((err, res) => {
            const exams: ExamInfo[] = res.body.examsList
            expect(exams.length).to.be.greaterThan(0)
            done()
        })
    })
    it('/ should not contain undefined', (done) => {
        chai.request(app).get('/').end((err, res) => {
            res.body.examsList.forEach((exam: any) => {
                expect(typeof exam).to.not.be.equal("undefined")
            })
            done()
        })
    })
    it('/ should consist all properties of ExamInfo', (done) => {
        chai.request(app).get('/').end((err, res) => {
            res.body.examsList.forEach((exam: any) => {
                expect(exam).to.haveOwnProperty("date")
                expect(exam).to.haveOwnProperty("time")
                expect(exam).to.haveOwnProperty("subject")
                expect(exam).to.haveOwnProperty("lecturers")
                expect(exam).to.haveOwnProperty("groups")
                expect(exam).to.haveOwnProperty("university")
            })
            done()
        })
    })
    it('/ should have correct types each part of ExamInfo', (done) => {
        chai.request(app).get('/').end((err, res) => {
            res.body.examsList.forEach((exam: ExamInfo) => {
                expect(typeof exam.date).to.be.equal("string")
                expect(typeof exam.time).to.be.equal("string")
                expect(typeof exam.subject).to.be.equal("string")
                expect(Array.isArray(exam.lecturers)).to.be.true
                expect(Array.isArray(exam.groups)).to.be.true
                expect(typeof exam.university).to.be.equal("string")
            })
            done()
        })
    })
    it('/ should not be empty field in each part of ExamInfo', (done) => {
        chai.request(app).get('/').end((err, res) => {
            res.body.examsList.forEach((exam: ExamInfo) => {
                expect(exam.date).to.not.be.equal("")
                expect(exam.time).to.not.be.equal("")
                expect(exam.subject).to.not.be.equal("")
                expect(exam.lecturers.length).to.be.greaterThan(0)
                expect(exam.groups.length).to.be.greaterThan(0)
                expect(exam.university).to.not.be.equal("")
            })
            done()
        })
    })
})

function expectStatus(request: any, status: number, done: Mocha.Done) {
    request.end((err: any, res: any) => {
        expect(res).to.have.status(status)
        done()
    })
}
