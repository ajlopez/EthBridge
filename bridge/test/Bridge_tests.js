const Bridge = artifacts.require('./Bridge');
const util = require('util');

async function expectThrow (promise) {
  try {
    await promise;
  } catch (error) {
      return;
  }
  
  assert.fail('Expected throw not received');
}

// from https://ethereum.stackexchange.com/questions/11444/web3-js-with-promisified-api

const promisify = (inner) =>
  new Promise((resolve, reject) =>
    inner((err, res) => {
      if (err) { reject(err) }

      resolve(res);
    })
);

contract('Bridge', function (accounts) {
    const creatorAccount = accounts[0];
    const managerAccount = accounts[1];
    const receiverAccount = accounts[2];
    
    beforeEach(async function () {
        this.bridge = await Bridge.new(managerAccount, { value: 1000000 });
    });
    
    it('initial ether balance for tests', async function () {
        const bridgeBalance = await web3.eth.getBalance(this.bridge.address);
        
        assert.equal(bridgeBalance.toNumber(), 1000000);
    });

    it('transfer to account using manager', async function () {
        const initialReceiverBalance = await web3.eth.getBalance(receiverAccount);
        
        await this.bridge.transferTo(receiverAccount, 1000, { from: managerAccount });

        const bridgeBalance = await web3.eth.getBalance(this.bridge.address);  
        
        assert.equal(bridgeBalance.toNumber(), 1000000 - 1000);
        
        const finalReceiverBalance = await web3.eth.getBalance(receiverAccount);
      
        assert.ok(initialReceiverBalance.add(1000).equals(finalReceiverBalance));
        
        const releaseEvent = this.bridge.Release({}, { fromBlock: 1, toBlock: 'latest' });

        const logs = await promisify(cb => releaseEvent.get(cb));
        
        assert.ok(logs);
        assert.ok(Array.isArray(logs));
        assert.ok(logs.length);
        assert.equal(logs[0].event, 'Release');
    });

    it('transfer to bridge generates lock event', async function () {
        const txhash = await web3.eth.sendTransaction({ from: accounts[0], to: this.bridge.address, value: 1000, gas: 100000 });

        var receipt;
        
        do {
            receipt = await web3.eth.getTransactionReceipt(txhash);
        } while(receipt == null);

        const bridgeBalance = await web3.eth.getBalance(this.bridge.address);  
        
        assert.equal(bridgeBalance.toNumber(), 1000000 + 1000);
        
        const lockEvent = this.bridge.Lock({}, { fromBlock: 1, toBlock: 'latest' });

        const logs = await promisify(cb => lockEvent.get(cb));
        
        assert.ok(logs);
        assert.ok(Array.isArray(logs));
        assert.ok(logs.length);
        assert.equal(logs[0].event, 'Lock');
    });

    it('transfer to account without using manager', async function () {
        const initialReceiverBalance = await web3.eth.getBalance(receiverAccount);
        
        expectThrow(this.bridge.transferTo(receiverAccount, 1000, { from: creatorAccount }));
    });
});

