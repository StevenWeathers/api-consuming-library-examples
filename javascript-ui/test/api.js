describe("Skynet", function() {
    it("should expose a Skynet constructor", function() {
        expect(Skynet).to.be.an('function');
    });

    it("should expose a skynet object", function() {
        expect(skynet).to.be.an('object');
    });

    it("should expose a skynet.getConfig method", function() {
        expect(skynet.getConfig).to.be.an('function');
    });

    it("should expose a skynet.setConfig method", function() {
        expect(skynet.setConfig).to.be.an('function');
    });

    it("should expose a skynet.member object", function() {
        expect(skynet.member).to.be.an('object');
    });
});
