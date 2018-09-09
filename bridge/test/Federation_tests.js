const Federation = artifacts.require('./Federation');

contract('Federation', function (accounts) {
    const federators = [accounts[1], accounts[2], accounts[3]];
    
    beforeEach(async function () {
        this.federation = await Federation.new(federators);
    });
    
    it('initial size', async function () {
        const size = await this.federation.size();
        
        assert.equal(size, federators.length);
    });

    it('is a federator', async function () {
        for (var k = 0; k < federators.length; k++) {
            const isfed = await this.federation.isFederator(federators[k]);
            
            assert.ok(isfed);
        }
    });

    it('is not a federator', async function () {
        const isfed = await this.federation.isFederator(accounts[0]);

        assert.ok(!isfed);

        for (var k = federators.length + 1; k < accounts.length; k++) {
            const isfed = await this.federation.isFederator(accounts[k]);
            
            assert.ok(!isfed);
        }
    });
});

