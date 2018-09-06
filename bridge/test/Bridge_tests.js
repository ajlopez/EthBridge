const Bridge = artifacts.require('./Bridge');

contract('Bridge', function (accounts) {
    beforeEach(async function () {
        this.bridge = await Bridge.new({ value: 1000000 });
    });
    
    it('initial ether balance for tests', async function () {
        const bridgeBalance = await web3.eth.getBalance(this.bridge.address);
        
        assert.equal(bridgeBalance.toNumber(), 1000000);
    });
});