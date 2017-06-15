describe("put", function() {
    var server;

    describe("when passing a url and data", function() {
        beforeEach(function() {
            server = sinon.fakeServer.create();
        });

        afterEach(function() {
            server.restore();
        });

        it("should return the response", function(testDone) {
            var url = "/get-something-cool";
            var testData = { someKey: "somevalue" };

            server.respondWith("PUT", url, [
                200,
                { "Content-Type": "application/json" },
                JSON.stringify(testData)
            ]);

            skynet.put(url, {})
                .done(function(response) {
                    expect(response).to.deep.equal(testData);
                    testDone();
                });

            server.respond(); // Process all requests so far
        });
    });

    describe("when passing a url, data and options", function() {
        beforeEach(function() {
            server = sinon.fakeServer.create();
        });

        afterEach(function() {
            server.restore();
        });

        it("should return the response", function(testDone) {
            var url = "/get-something-cool";
            var testData = { someKey: "somevalue" };

            server.respondWith("PUT", url, [
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

            skynet.put(url, {}, ajaxOptions)
                .done(function(response) {
                    expect(response).to.deep.equal({someKey: "someOtherValue"});
                    testDone();
                });

            server.respond(); // Process all requests so far
        });
    });
});
