import chaiHttp from 'chai-http';
import app from '../src/app'
import {expect} from "chai";
import chai from 'chai'
import {Response} from "express";

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
})

function expectStatus(request: any, status: number, done: Mocha.Done) {
    request.end((err: any, res: any) => {
        expect(res).to.have.status(status)
        done()
    })
}
