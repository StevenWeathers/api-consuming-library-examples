describe("delete", function() {
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

            server.respondWith("DELETE", url, [
                200,
                { "Content-Type": "application/json" },
                JSON.stringify(testData)
            ]);

            skynet.delete(url)
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

            server.respondWith("DELETE", url, [
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

            skynet.delete(url, ajaxOptions)
                .done(function(response) {
                    expect(response).to.deep.equal({someKey: "someOtherValue"});
                    testDone();
                });

            server.respond(); // Process all requests so far
        });
    });
});
