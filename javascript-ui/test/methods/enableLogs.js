describe("enableLogs", function(){
    after(function(){
        expect(skynet.disableLogs()).to.equal("Logs are disabled.");
    });

    it("should return the proper string", function(){
        expect(skynet.enableLogs()).to.equal("Logs are enabled.");
    });
});
