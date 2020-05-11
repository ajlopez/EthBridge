const Vault = artifacts.require('./Vault');
const BasicVaultManager = artifacts.require('./BasicVaultManager');

const expectThrow = require('./utils').expectThrow;

contract('Basic Vault Manager', function (accounts) {
    const ownerAccount = accounts[0];
    const receiverAccount = accounts[1];
    
    beforeEach(async function () {
        this.manager = await BasicVaultManager.new();
        this.vault = await Vault.new(this.manager.address);
        await this.manager.setVault(this.vault.address);

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
        
        await this.manager.transferTo(receiverAccount, 1000, { from: ownerAccount });
        
        const vaultBalance = await web3.eth.getBalance(this.vault.address);  
        
        assert.equal(vaultBalance, 1000000 - 1000);
        
        const finalReceiverBalance = await web3.eth.getBalance(receiverAccount);
        assert.equal(parseInt(initialReceiverBalance) + 1000, finalReceiverBalance);
    });

    it('transfer to account without using manager', async function () {
        const initialReceiverBalance = await web3.eth.getBalance(receiverAccount);
        
        await expectThrow(this.vault.transferTo(receiverAccount, 1000, { from: ownerAccount }));
    });
});

