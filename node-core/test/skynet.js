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
const Skynet = new require('../Skynet.js')({endpoint: "skynet.softwr.com", headers: {"Authorization": "Basic 007"}});

describe('Skynet.queryString', function() {
    describe('when a valid object of params is passed', function() {
        it('should return a querystring', function(done){
            let catEntryId = "3825413";
            let storeNum = "0595";

            let stringified = Skynet.queryString({catId: catEntryId, storeNumber: storeNum});
            let validString = `?catId=${catEntryId}&storeNumber=${storeNum}`;

            expect(stringified).to.equal(validString);
            done();
        })
    });
});

describe('Skynet.get', function() {

    describe('when response is valid without options', function() {
        let catEntryId = "3825413";
        let storeNum = "0595";
        let requestPath = "/some/url/id";

        let validResponse = {"statusCode":200,"body":{"someKey": "someValue"}};

        //setup
        before(function(done){
            nock('http://api.skynet.com')
                .get(requestPath + '?catId='+catEntryId+'&storeNumber='+storeNum)
                .reply(validResponse.statusCode, validResponse.body);
            done();
        });
        //teardown
        after(function(done){
            nock.cleanAll();
            done();
        });

        it('should return the data from service', function(done) {
            Skynet.get(requestPath + Skynet.queryString({catId: catEntryId, storeNumber: storeNum}), function(err, response) {
                expect(response).to.equal(validResponse.body);
                done();
            });
        });
    });

    describe('when response is valid with options', function() {
        let catEntryId = "3825413";
        let storeNum = "0595";
        let requestPath = "/some/url/id";

        let validResponse = {"statusCode":200,"body":{"someKey": "someValue"}};

        //setup
        before(function(done){
            nock('http://api.skynet.com')
                .get(requestPath + '?catId='+catEntryId+'&storeNumber='+storeNum)
                .reply(validResponse.statusCode, validResponse.body);
            done();
        });
        //teardown
        after(function(done){
            nock.cleanAll();
            done();
        });

        it('should return the data from service', function(done) {
            Skynet.get(requestPath + Skynet.queryString({catId: catEntryId, storeNumber: storeNum}), {}, function(err, response) {
                expect(response).to.equal(validResponse.body);
                done();
            });
        });
    });

    describe('when response through proxy is valid', function() {
        let catEntryId = "3825413";
        let storeNum = "0595";
        let requestPath = "/some/url/id";

        let SkynetProxy = new require('../Skynet.js')({endpoint: "api.skynet.com", headers: {"Authorization": "Basic 007"}, proxy: "http://127.0.0.1:3128"});
        let validResponse = {"statusCode":200,"body":{"someKey": "someValue"}};

        //setup
        before(function(done){
            nock('http://api.skynet.com')
                .get(requestPath +'?catId='+catEntryId+'&storeNumber='+storeNum)
                .reply(validResponse.statusCode, validResponse.body);
            done();
        });
        //teardown
        after(function(done){
            nock.cleanAll();
            done();
        });

        it('should return the data from service', function(done) {
            SkynetProxy.get(requestPath+ Skynet.queryString({catId: catEntryId, storeNumber: storeNum}), function(err, response) {
                expect(response).to.equal(validResponse.body);
                done();
            });
        });
    });

    describe('when a parameter is duplicated', function() {
        let nValue = "4294778723";
        let refinements = ["4294796421", "5007197"];
        let refinementsQuery = "&refinement="+refinements[0]+"&refinement="+refinements[1];
        let requestPath = "/some/url/id";

        let validResponse = {"statusCode":200,"body":{"someKey": "someValue"}};

        //setup
        before(function(done){
            nock('http://api.skynet.com')
                .get(requestPath +'?nValue='+nValue+refinementsQuery)
                .reply(validResponse.statusCode, validResponse.body);
            done();
        });
        //teardown
        after(function(done){
            nock.cleanAll();
            done();
        });

        it('should still succeed when a param value is an array', function (done) {
            Skynet.get(requestPath + Skynet.queryString({nValue: nValue, refinement: refinements}), function(err, response){
                expect(response).to.equal(validResponse.body);
                done();
            });
        });
    });

    describe('when response status code is not 200', function() {
        let requestPath = "/some/url/id";
        let validResponse = {"statusCode":500,"body":{"someKey": "someValue"}};

        //setup
        before(function(done){
            nock('http://api.skynet.com')
                .get(requestPath)
                .reply(validResponse.statusCode, validResponse.body);
            done();
        });
        //teardown
        after(function(done){
            nock.cleanAll();
            done();
        });

        it('should should throw an error', function (done) {
            Skynet.get(requestPath, function(e, response){
                expect(e.message).to.equal("Failed with status code of 500");
                done();
            });
        });
    });

    describe('when an error in request occurs', function() {
        let requestPath = "/some/url/id";

        //setup
        before(function(done){
            nock('http://api.skynet.com')
                .get(requestPath)
                .replyWithError('something awful happened');
            done();
        });
        //teardown
        after(function(done){
            nock.cleanAll();
            done();
        });

        it('should should throw an error', function (done) {
            Skynet.get(requestPath, function(e, response){
                expect(e.message).to.equal("Client request error: something awful happened");
                done();
            });
        });
    });

});

describe('Skynet.post', function() {

    describe('when valid path with payload', function() {
        let requestPath = "/data/submitfeedback.json";
        let validResponse = {"Data":{},"HasErrors":false,"Form":[],"AuthorSubmissionToken":null,"FormErrors":{},"TypicalHoursToPost":null,"SubmissionId":null,"Feedback":{"Inappropriate":{"ReasonText":null,"AuthorId":"z74fm1u7i5etg8sxw7dbyy1ewm"}},"Locale":"en_US","Errors":[]};
        let postOptions = {
            payload: {
                PassKey: "yourmom",
                ApiVersion: "5.4",
                ContentType: "answer",
                ContentId: "1656028",
                FeedbackType: "Inappropriate"
            },
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        };

        //setup
        before(function(done){
            nock('http://api.skynet.com')
                .post(requestPath, postOptions.payload)
                .reply(200, validResponse)
            done();
        });
        //teardown
        after(function(done){
            nock.cleanAll();
            done();
        });

        it('should return the response if successful', function(done) {
            Skynet.post(requestPath, postOptions, function(err, response) {
                expect(response).to.equal(validResponse);
                done();
            });
        });
    });

    describe('when valid path without payload', function() {
        let requestPath = "/data/submitfeedback.json";
        let validResponse = {"Data":{},"HasErrors":false,"Form":[],"AuthorSubmissionToken":null,"FormErrors":{},"TypicalHoursToPost":null,"SubmissionId":null,"Feedback":{"Inappropriate":{"ReasonText":null,"AuthorId":"z74fm1u7i5etg8sxw7dbyy1ewm"}},"Locale":"en_US","Errors":[]};
        let postOptions = {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        };

        //setup
        before(function(done){
            nock('http://api.skynet.com')
                .post(requestPath)
                .reply(200, validResponse)
            done();
        });
        //teardown
        after(function(done){
            nock.cleanAll();
            done();
        });

        it('should return the response if successful', function(done) {
            Skynet.post(requestPath, postOptions, function(err, response) {
                expect(response).to.equal(validResponse);
                done();
            });
        });
    });

    describe('when response status code is not 200', function() {
        let requestPath = "/data/submitfeedback.json";

        //setup
        before(function(done){
            nock('http://api.skynet.com')
                .post(requestPath)
                .reply(500, {});
            done();
        });
        //teardown
        after(function(done){
            nock.cleanAll();
            done();
        });

        it('should should throw an error when the service responds with an error code', function (done) {
            Skynet.post(requestPath, function(e, response){
                expect(e.message).to.equal("Failed with status code of 500");
                done();
            });
        });
    });

    describe('Error in request', function() {
        let requestPath = "/data/submitfeedback.json";

        //setup
        before(function(done){
            nock('http://api.skynet.com')
                .post(requestPath)
                .replyWithError('something awful happened');
            done();
        });
        //teardown
        after(function(done){
            nock.cleanAll();
            done();
        });

        it('should should throw an error when the request encounters a problem', function (done) {
            Skynet.post(requestPath, function(e, response){
                expect(e.message).to.equal("Client request error: something awful happened");
                done();
            });
        });
    });

});

describe('Skynet.put', function() {

    describe('when valid path with payload', function() {
        let requestPath = "/data/submitfeedback.json";
        let validResponse = {"Data":{}};
        let postOptions = {
            payload: {
                PassKey: "yourmom",
                ApiVersion: "5.4",
                ContentType: "answer",
                ContentId: "1656028",
                FeedbackType: "Inappropriate"
            },
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        };

        //setup
        before(function(done){
            nock('http://api.skynet.com')
                .put(requestPath, postOptions.payload)
                .reply(200, validResponse)
            done();
        });
        //teardown
        after(function(done){
            nock.cleanAll();
            done();
        });

        it('should return the response if successful', function(done) {
            Skynet.put(requestPath, postOptions, function(err, response) {
                expect(response).to.equal(validResponse);
                done();
            });
        });
    });

    describe('when valid path without payload', function() {
        let requestPath = "/data/submitfeedback.json";
        let validResponse = {"Data":{}};
        let postOptions = {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        };

        //setup
        before(function(done){
            nock('http://api.skynet.com')
                .put(requestPath)
                .reply(200, validResponse)
            done();
        });
        //teardown
        after(function(done){
            nock.cleanAll();
            done();
        });

        it('should return the response if successful', function(done) {
            Skynet.put(requestPath, postOptions, function(err, response) {
                expect(response).to.equal(validResponse);
                done();
            });
        });
    });

    describe('when response status code is not 200', function() {
        let requestPath = "/data/submitfeedback.json";

        //setup
        before(function(done){
            nock('http://api.skynet.com')
                .put(requestPath)
                .reply(500, {});
            done();
        });
        //teardown
        after(function(done){
            nock.cleanAll();
            done();
        });

        it('should should throw an error when the service responds with an error code', function (done) {
            Skynet.put(requestPath, function(e, response){
                expect(e.message).to.equal("Failed with status code of 500");
                done();
            });
        });
    });

    describe('Error in request', function() {
        let requestPath = "/data/submitfeedback.json";

        //setup
        before(function(done){
            nock('http://api.skynet.com')
                .put(requestPath)
                .replyWithError('something awful happened');
            done();
        });
        //teardown
        after(function(done){
            nock.cleanAll();
            done();
        });

        it('should should throw an error when the request encounters a problem', function (done) {
            Skynet.put(requestPath, function(e, response){
                expect(e.message).to.equal("Client request error: something awful happened");
                done();
            });
        });
    });

});

describe('Skynet.delete', function() {

    describe('when valid path with response of 200', function() {
        let requestPath = "/some/url/id";

        //setup
        before(function(done){
            nock('http://api.skynet.com')
                .delete(requestPath)
                .reply(200, {})
            done();
        });
        //teardown
        after(function(done){
            nock.cleanAll();
            done();
        });

        it('should return the response if successful', function(done) {
            Skynet.delete(requestPath, function(err, response) {
                expect(response).to.equal({});
                done();
            });
        });
    });

    describe('when valid path with response of 204', function() {
        let requestPath = "/some/url/id";

        //setup
        before(function(done){
            nock('http://api.skynet.com')
                .delete(requestPath)
                .reply(204, {})
            done();
        });
        //teardown
        after(function(done){
            nock.cleanAll();
            done();
        });

        it('should return the response if successful', function(done) {
            Skynet.delete(requestPath, function(err, response) {
                expect(response).to.equal({});
                done();
            });
        });
    });

    describe('when response status code is not 200', function() {
        let requestPath = "/data/submitfeedback.json";

        //setup
        before(function(done){
            nock('http://api.skynet.com')
                .delete(requestPath)
                .reply(500, {});
            done();
        });
        //teardown
        after(function(done){
            nock.cleanAll();
            done();
        });

        it('should should throw an error when the service responds with an error code', function (done) {
            Skynet.delete(requestPath, {}, function(e, response){
                expect(e.message).to.equal("Failed with status code of 500");
                done();
            });
        });
    });

    describe('Error in request', function() {
        let requestPath = "/data/submitfeedback.json";

        //setup
        before(function(done){
            nock('http://api.skynet.com')
                .delete(requestPath)
                .replyWithError('something awful happened');
            done();
        });
        //teardown
        after(function(done){
            nock.cleanAll();
            done();
        });

        it('should should throw an error when the request encounters a problem', function (done) {
            Skynet.delete(requestPath, function(e, response){
                expect(e.message).to.equal("Client request error: something awful happened");
                done();
            });
        });
    });

});


describe('Skynet', function() {
    let defaultConfig = Skynet.getConfig();

    describe('setConfig()', function() {
        let sampleUrl1 = "http://www.google.com";
        let sampleUrl2 = "http://www.skynet.com";
        let SetConfigTestSkynet1 = new require('../Skynet.js')();
        let SetConfigTestSkynet2 = new require('../Skynet.js')();

        //setup
        before(function(done){
            SetConfigTestSkynet1.setConfig({endpoint: sampleUrl1});
            SetConfigTestSkynet2.setConfig({endpoint: sampleUrl2});
            done();
        });
        //teardown
        after(function(done){
            SetConfigTestSkynet1.setConfig(defaultConfig);
            SetConfigTestSkynet2.setConfig(defaultConfig);
            done();
        });

        it('should should update the config object with any configs passed', function(done){
            expect(SetConfigTestSkynet1.getConfig().endpoint).to.equal(sampleUrl1);
            expect(SetConfigTestSkynet2.getConfig().endpoint).to.equal(sampleUrl2);
            done();
        });
    });

    describe('setConfig() SSL', function() {
        let sampleUrl1 = "https://www.google.com";
        let sampleUrl2 = "https://test.skynet.com";
        let SetConfigTestSkynet1 = new require('../Skynet.js')();
        let SetConfigTestSkynet2 = new require('../Skynet.js')();

        //setup
        before(function(done){
            SetConfigTestSkynet1.setConfig({endpoint: sampleUrl1, ssl: true});
            SetConfigTestSkynet2.setConfig({endpoint: sampleUrl2, ssl: true});
            done();
        });
        //teardown
        after(function(done){
            SetConfigTestSkynet1.setConfig(defaultConfig);
            SetConfigTestSkynet2.setConfig(defaultConfig);
            done();
        });

        it('should should update the config object with any configs passed', function(done){
            expect(SetConfigTestSkynet1.getConfig().endpoint).to.equal(sampleUrl1);
            expect(SetConfigTestSkynet2.getConfig().endpoint).to.equal(sampleUrl2);
            done();
        });
    });

    describe("When config.json exists", function() {
        let xmlResponse = '<promotional_items></promotional_items>';
        let xmlRequestPath = "/xmltest";
        let XmlSkynet = new require('../Skynet.js')({
            endpoint: "test.skynet.com",
            json: "false"
        });

        //setup
        before(function(done){
            nock('http://test.skynet.com')
                .get(xmlRequestPath)
                .reply(200, xmlResponse);
            done();
        });

        //teardown
        after(function(done){
            nock.cleanAll();
            done();
        });

        it("should not force json", function(done) {
            XmlSkynet.get(xmlRequestPath, function(err, response) {
                expect(response.toString()).to.equal(xmlResponse);
                done();
            });
        })
    });

    describe("When proxy is set", function() {
        let proxyRequestPath = "/proxy-test";
        let proxySkynet = new require('../Skynet.js')({
            endpoint: "test.skynet.com",
            proxy: "proxytest.skynet.com"
        });

        //setup
        before(function(done){
            nock('http://test.skynet.com')
                .get(proxyRequestPath)
                .reply(200);
            nock('http://proxytest.skynet.com')
                .get()
                .reply(200);
            done();
        });

        //teardown
        after(function(done){
            nock.cleanAll();
            done();
        });

        it("should use proxy agent", function(done) {
            proxySkynet.get(proxyRequestPath, function(err, response) {
                expect(err).to.not.exist();
                done();
            });
        })
    });

    describe("When proxy is set with SSL", function() {
        let proxyRequestPath = "/proxy-test";
        let proxySkynet = new require('../Skynet.js')({
            endpoint: "test.skynet.com",
            proxy: "proxytest.skynet.com",
            ssl: true
        });

        //setup
        before(function(done){
            nock('https://test.skynet.com')
                .get(proxyRequestPath)
                .reply(200);
            nock('https://proxytest.skynet.com')
                .get()
                .reply(200);
            done();
        });

        //teardown
        after(function(done){
            nock.cleanAll();
            done();
        });

        it("should use proxy agent", function(done) {
            proxySkynet.get(proxyRequestPath, function(err, response) {
                expect(err).to.not.exist();
                done();
            });
        })
    });

    describe('Instantiate with configs', function() {
        let sampleUrl3 = "http://www.joyent.com";
        let sampleUrl4 = "http://www.docker.com";
        let SetConfigTestSkynet3 = new require('../Skynet.js')({endpoint: sampleUrl3});
        let SetConfigTestSkynet4 = new require('../Skynet.js')({endpoint: sampleUrl4});

        it('should should update the config object with any configs passed', function(done){
            expect(SetConfigTestSkynet3.getConfig().endpoint).to.equal(sampleUrl3);
            expect(SetConfigTestSkynet4.getConfig().endpoint).to.equal(sampleUrl4);
            done();
        });
    });

});
