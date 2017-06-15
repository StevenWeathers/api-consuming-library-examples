describe("get", function() {
    var server;

    describe("when passing a url", function() {
        beforeEach(function() {
            server = sinon.fakeServer.create();
        });

        afterEach(function() {
            server.restore();
        });

        it("should return the response", function(testDone) {
            var url = "/get-something-cool";
            var testData = { someKey: "somevalue" };

            server.respondWith("GET", url, [
                200,
                { "Content-Type": "application/json" },
                JSON.stringify(testData)
            ]);

            skynet.get(url)
                .done(function(response) {
                    expect(response).to.deep.equal(testData);
                    testDone();
                });

            server.respond(); // Process all requests so far
        });
    });

    describe("when passing a url and options", function() {
        beforeEach(function() {
            server = sinon.fakeServer.create();
        });

        afterEach(function() {
            server.restore();
        });

        it("should return the response", function(testDone) {
            var url = "/get-something-cool";
            var testData = { someKey: "somevalue" };

            server.respondWith("GET", url, [
                200,
                { "Content-Type": "application/json" },
                JSON.stringify(testData)
            ]);

            var ajaxOptions = {
                dataFilter: function(response) {
                    response = JSON.parse(response);

                    response.someKey = "someOtherValue";

                    return JSON.stringify(response);
                }
            };

            skynet.get(url, ajaxOptions)
                .done(function(response) {
                    expect(response).to.deep.equal({someKey: "someOtherValue"});
                    testDone();
                });

            server.respond(); // Process all requests so far
        });
    });

    describe("when passing a url and custom headers", function() {
        beforeEach(function() {
            server = sinon.fakeServer.create();
        });

        afterEach(function() {
            server.restore();
        });

        it("should return the response", function(testDone) {
            var url = "/get-something-cool";
            var testData = { someKey: "somevalue" };

            server.respondWith("GET", url, [
                200,
                {
                    "Content-Type": "application/json"
                },
                JSON.stringify(testData)
            ]);

            var ajaxOptions = {
                headers: {
                    "coolHeader": "testing1234"
                }
            };

            skynet.get(url, ajaxOptions)
                .done(function(response) {
                    var header = server.requests[0].requestHeaders["coolHeader"];
                    expect(header).to.equal("testing1234");
                    testDone();
                });

            server.respond(); // Process all requests so far
        });
    });
});
