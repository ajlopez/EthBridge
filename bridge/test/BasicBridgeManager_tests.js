const Bridge = artifacts.require('./Bridge');
const BasicBridgeManager = artifacts.require('./BasicBridgeManager');

const expectThrow = require('./utils').expectThrow;

contract('Basic Bridge Manager', function (accounts) {
    const ownerAccount = accounts[0];
    const receiverAccount = accounts[1];
    
    beforeEach(async function () {
        this.manager = await BasicBridgeManager.new();
        this.bridge = await Bridge.new(this.manager.address);
        await this.manager.setBridge(this.bridge.address);

        const txhash = (await web3.eth.sendTransaction({ from: accounts[0], to: this.bridge.address, value: 1000000, gas: 100000 })).transactionHash;
        
        var receipt;
        
        do {
            receipt = await web3.eth.getTransactionReceipt(txhash);
        } while(receipt == null);
    });
    
    it('initial ether balance for tests', async function () {
        const bridgeBalance = await web3.eth.getBalance(this.bridge.address);
        
        assert.equal(bridgeBalance, 1000000);
    });

    it('transfer to account using manager', async function () {
        const initialReceiverBalance = await web3.eth.getBalance(receiverAccount);
        
        await this.manager.transferTo(receiverAccount, 1000, { from: ownerAccount });
        
        const bridgeBalance = await web3.eth.getBalance(this.bridge.address);  
        
        assert.equal(bridgeBalance, 1000000 - 1000);
        
        const finalReceiverBalance = await web3.eth.getBalance(receiverAccount);
        assert.equal(parseInt(initialReceiverBalance) + 1000, finalReceiverBalance);
    });

    it('transfer to account without using manager', async function () {
        const initialReceiverBalance = await web3.eth.getBalance(receiverAccount);
        
        await expectThrow(this.bridge.transferTo(receiverAccount, 1000, { from: ownerAccount }));
    });
});

