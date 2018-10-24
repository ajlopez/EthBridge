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
        
        const transferEvent = this.bridge.Transfer({}, { fromBlock: 0, toBlock: 'latest' });
        
        const transferEventGet = util.promisify(transferEvent.get);
        
        const logs = await transferEventGet();        
    });

    it('transfer to account without using manager', async function () {
        const initialReceiverBalance = await web3.eth.getBalance(receiverAccount);
        
        expectThrow(this.bridge.transferTo(receiverAccount, 1000, { from: creatorAccount }));
    });
});

