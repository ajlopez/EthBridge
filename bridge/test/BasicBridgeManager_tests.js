const Bridge = artifacts.require('./Bridge');
const BasicBridgeManager = artifacts.require('./BasicBridgeManager');

const expectThrow = require('./utils').expectThrow;

contract('Simple Bridge Manager', function (accounts) {
    const ownerAccount = accounts[0];
    const receiverAccount = accounts[1];
    
    beforeEach(async function () {
        this.manager = await BasicBridgeManager.new();
        this.bridge = await Bridge.new(this.manager.address, { value: 1000000 });
        await this.manager.setBridge(this.bridge.address);
    });
    
    it('initial ether balance for tests', async function () {
        const bridgeBalance = await web3.eth.getBalance(this.bridge.address);
        
        assert.equal(bridgeBalance.toNumber(), 1000000);
    });

    it('transfer to account using manager', async function () {
        const initialReceiverBalance = await web3.eth.getBalance(receiverAccount);
        
        await this.manager.transferTo(receiverAccount, 1000, { from: ownerAccount });
        
        const bridgeBalance = await web3.eth.getBalance(this.bridge.address);  
        
        assert.equal(bridgeBalance.toNumber(), 1000000 - 1000);
        
        const finalReceiverBalance = await web3.eth.getBalance(receiverAccount);
      
        assert.ok(initialReceiverBalance.add(1000).equals(finalReceiverBalance));
    });

    it('transfer to account without using manager', async function () {
        const initialReceiverBalance = await web3.eth.getBalance(receiverAccount);
        
        expectThrow(this.bridge.transferTo(receiverAccount, 1000, { from: ownerAccount }));
    });
});

