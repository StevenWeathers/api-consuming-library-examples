describe("setConfig", function() {
    var skynetConfigTest = new Skynet();

    describe("when setConfig is called with an object", function(){
        it("should override the config based on options based", function() {
            skynetConfigTest.setConfig({ someKey: "someValue" });

            expect(skynetConfigTest.getConfig()).to.deep.equal({ someKey: "someValue" });
        });
    });
});
