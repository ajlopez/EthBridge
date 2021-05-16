const CryptoVault = artifacts.require('./CryptoVault');
const util = require('util');

const expectThrow = require('./utils').expectThrow;
const promisify = require('./utils').promisify;

contract('CryptoVault', function (accounts) {
    const creatorAccount = accounts[0];
    const managerAccount = accounts[1];
    const receiverAccount = accounts[2];
    
    beforeEach(async function () {
        this.vault = await CryptoVault.new(managerAccount);

        const txhash = (await web3.eth.sendTransaction({ from: accounts[0], to: this.vault.address, value: 1000000, gas: 100000 })).transactionHash;

        var receipt;
        
        do {
            receipt = await web3.eth.getTransactionReceipt(txhash);
        } while(receipt == null);
    });
    
    it('initial ether balance for tests', async function () {
        const vaultBalance = await web3.eth.getBalance(this.vault.address);
        
        assert.equal(vaultBalance, 1000000);
    });

    it('transfer to account using manager', async function () {
        const initialReceiverBalance = await web3.eth.getBalance(receiverAccount);
        
        const result = await this.vault.transferTo(receiverAccount, 1000, { from: managerAccount });

        const vaultBalance = await web3.eth.getBalance(this.vault.address);  
        
        assert.equal(vaultBalance, 1000000 - 1000);
        
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

    it('transfer to vault generates lock event', async function () {
        const txresult = await this.vault.sendTransaction({ from: accounts[0], value: 1000, gas: 100000 });
        
        const vaultBalance = await web3.eth.getBalance(this.vault.address);  
        
        assert.equal(vaultBalance, 1000000 + 1000);
        
        const logs = txresult.logs;
        
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
        
        expectThrow(this.vault.transferTo(receiverAccount, 1000, { from: creatorAccount }));
    });
});

