const CryptoVault = artifacts.require('./CryptoVault');
const util = require('util');

const expectThrow = require('./utils').expectThrow;
const promisify = require('./utils').promisify;

contract('CryptoVault', function (accounts) {
    let vault;
    
    const alice = accounts[0];
    const managerAccount = accounts[1];
    const charlie = accounts[2];
    
    beforeEach(async function () {
        vault = await CryptoVault.new();
    });

    it('lock value', async function () {
        const txresult = await vault.lockValue(charlie, { from: alice, value: 1000000 });

        const vaultBalance = await web3.eth.getBalance(vault.address);  
        
        assert.equal(vaultBalance, 1000000);
    });
});

