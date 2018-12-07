
async function expectThrow (promise) {
  try {
    await promise;
  } catch (error) {
      return;
  }
  
  assert.fail('Expected throw not received');
}

async function transferValue(from, to, value) {
    const txhash = await web3.eth.sendTransaction({ from: from, to: to, value: value, gas: 100000 });

    var receipt;
    
    do {
        receipt = await web3.eth.getTransactionReceipt(txhash);
    } while(receipt == null);
}

// from https://ethereum.stackexchange.com/questions/11444/web3-js-with-promisified-api

const promisify = (inner) =>
  new Promise((resolve, reject) =>
    inner((err, res) => {
      if (err) { reject(err) }

      resolve(res);
    })
);

module.exports = {
    expectThrow: expectThrow,
    promisify: promisify,
    transferValue: transferValue
}

