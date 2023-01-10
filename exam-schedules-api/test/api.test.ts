import chaiHttp from 'chai-http';
import app from '../src/app'
import {expect} from "chai";
import chai from 'chai'


describe('Test Api', function () {
    chai.use(chaiHttp)
    it('should return 200', function () {
        chai.request(app)
            .get('/')
            .end((err, res) => {
                expect(err).to.be.null
                expect(res).to.have.status(200)
            })
    });

});