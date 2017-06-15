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

// Product Object Tests
describe('Product', function() {
	let Product = new require('../product')();

	describe('when instantiated with a config object', function() {
	    it("should update Product's endpoint", function(testDone) {
	    	//setup
		    let testEndpoint = "www.skynettest.com";
		    let testEndpointAlt = "www.skynettest.net";
		    let InitProduct = new require('../product')({endpoint: testEndpoint});
		    let InitProductAlt = new require('../product')({endpoint: testEndpointAlt});

	        expect(InitProduct.getConfig().endpoint).to.equal(testEndpoint);
	        expect(InitProductAlt.getConfig().endpoint).to.equal(testEndpointAlt);
	        testDone();
	    });
	});
});
