const CryptoVault = artifacts.require('./CryptoVault');
const util = require('util');
const truffleAssert = require('truffle-assertions');

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
        
        truffleAssert.eventEmitted(txresult, 'Lock', 
            function (ev) {
                return ev.sender.toLowerCase() === alice.toLowerCase() &&
                    ev.receiver.toLowerCase() === charlie.toLowerCase() &&
                    ev.nlock == 0 &&
                    ev.amount == 1000000;
            }
        );

        const vaultBalance = await web3.eth.getBalance(vault.address);  
        
        assert.equal(vaultBalance, 1000000);
    });
});

