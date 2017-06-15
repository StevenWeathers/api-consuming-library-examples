"use strict";

const Code = require('code');
const expect = Code.expect;
const Lab = require('lab');
const lab = exports.lab = Lab.script();
const describe = lab.describe;
const it = lab.it;
const before = lab.before;
const after = lab.after;
const beforeEach = lab.beforeEach;
const afterEach = lab.afterEach;
const nock = require('nock');

describe('getbyId Method', function() {
    let serviceHost = "test.skynet.com";
    let Product = new require('../product')({endpoint: serviceHost});
    let servicePath = `http://${serviceHost}`;
    let requestPath = `<%= servicePath %>`;

    let validResponse = {};

    describe('when service returns a valid response', function() {

        //setup
        before(function(done){
            nock(servicePath)
                .get(requestPath)
                .query(true)
                .reply(200, validResponse);
            done();
        });
        //teardown
        after(function(done){
            nock.cleanAll();
            done();
        });

        it('should return the product data', function(testDone) {
            Product.getbyId({id: "1234567890"}, function(err, response) {
                expect(response).to.deep.equal(validResponse);
                testDone();
            });
        });
    });

    describe('when service returns a status code other than 200', function() {
        let expectedMessage = "Failed with status code of 500";

        //setup
        before(function(done){
            nock(servicePath)
                .get(requestPath)
                .query(true)
                .reply(500, {});
            done();
        });
        //teardown
        after(function(done){
            nock.cleanAll();
            done();
        });

        it('should return an error', function(testDone) {
            Product.getbyId({id: "1234567891"}, function(err, response) {
                expect(err.message).to.equal(expectedMessage);
                testDone();
            });
        });
    });

    describe('when passed an invalid parameter', function() {
        it('should return an error before trying to make a request', function(testDone) {
            Product.getbyId({id: null}, function(err, response) {
                expect(err.message).to.exist();
                testDone();
            });
        });
    });

});
