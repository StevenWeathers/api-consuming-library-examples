describe("getConfig", function() {
    var skynetgetConfigTest = new Skynet();

    describe("when getConfig is called", function(){
        it("should return the config", function() {
            expect(skynetgetConfigTest.getConfig()).to.deep.equal({});
            cskynetgetConfigTest.setConfig({ someKey: "someValue" });
            expect(skynetgetConfigTest.getConfig()).to.deep.equal({ someKey: "someValue" });
        });
    });
});
