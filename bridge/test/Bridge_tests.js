const Bridge = artifacts.require('./Bridge');
const util = require('util');

const expectThrow = require('./utils').expectThrow;
const promisify = require('./utils').promisify;

contract('Bridge', function (accounts) {
    const creatorAccount = accounts[0];
    const managerAccount = accounts[1];
    const receiverAccount = accounts[2];
    
    beforeEach(async function () {
        this.bridge = await Bridge.new(managerAccount);

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
        
        const result = await this.bridge.transferTo(receiverAccount, 1000, { from: managerAccount });

        const bridgeBalance = await web3.eth.getBalance(this.bridge.address);  
        
        assert.equal(bridgeBalance, 1000000 - 1000);
        
        const finalReceiverBalance = await web3.eth.getBalance(receiverAccount);
      
        assert.equal(parseInt(initialReceiverBalance) + 1000, finalReceiverBalance);
        
        const logs = result.logs;
        
        assert.ok(logs);
        assert.ok(Array.isArray(logs));
        assert.ok(logs.length);
        assert.equal(logs[0].event, 'Release');
        
        assert.equal(logs[0].args.receiver, receiverAccount);
        assert.equal(logs[0].args.nrelease, 1);
        assert.equal(logs[0].args.amount, 1000);
    });

    it('transfer to bridge generates lock event', async function () {
        const txhash = (await web3.eth.sendTransaction({ from: accounts[0], to: this.bridge.address, value: 1000, gas: 100000 })).transactionHash;

        var receipt;
        
        do {
            receipt = await web3.eth.getTransactionReceipt(txhash);
        } while(receipt == null);

        const bridgeBalance = await web3.eth.getBalance(this.bridge.address);  
        
        assert.equal(bridgeBalance, 1000000 + 1000);
        
        console.dir(receipt);
        console.dir(receipt.logs[0].topics);
        
        const logs = receipt.logs;
        
        assert.ok(logs);
        assert.ok(Array.isArray(logs));
        assert.ok(logs.length);
        assert.equal(logs.length, 1);
        
        assert.equal(logs[0].event, 'Lock');
        assert.equal(logs[0].args.sender, accounts[0]);
        assert.equal(logs[0].args.nlock, 2);
        assert.equal(logs[0].args.amount, 1000);
    });

    it('transfer to account without using manager', async function () {
        const initialReceiverBalance = await web3.eth.getBalance(receiverAccount);
        
        expectThrow(this.bridge.transferTo(receiverAccount, 1000, { from: creatorAccount }));
    });
});

