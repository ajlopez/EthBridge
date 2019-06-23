const expectThrow = require('./utils').expectThrow;

const Federation = artifacts.require('./Federation');
const Ballot = artifacts.require('./Ballot');

contract('Federation', function (accounts) {
    const federators = [accounts[1], accounts[2], accounts[3]];
    const receiver = accounts[4];
    const nonmember = accounts[5];
        
    beforeEach(async function () {
        this.federation = await Federation.new(federators);
    });
    
    it('initial size', async function () {
        const size = await this.federation.size();
        
        assert.equal(size, federators.length);
    });

    it('is a federator', async function () {
        for (var k = 0; k < federators.length; k++) {
            const isfed = await this.federation.isFederator(federators[k]);
            
            assert.ok(isfed);
        }
    });

    it('is not a federator', async function () {
        const isfed = await this.federation.isFederator(accounts[0]);

        assert.ok(!isfed);

        for (var k = federators.length + 1; k < accounts.length; k++) {
            const isfed = await this.federation.isFederator(accounts[k]);
            
            assert.ok(!isfed);
        }
    });
    
    it('has ballot and controls it', async function () {
        const ballot = new Ballot(await this.federation.ballot());

        assert.ok(ballot);
        
        const ballotOwner = await ballot.owner();
        
        assert.ok(ballotOwner);
        assert.equal(ballotOwner, this.federation.address);
    });
    
    it('get transfer vote id', async function () {
        const voteid = await this.federation.getTransferVoteId(1, '0x02', '0x03', receiver, 1000);
        
        assert.ok(voteid);
        
        const voteid2 = await this.federation.getTransferVoteId(1, '0x02', '0x03', receiver, 1000);
        const voteid3 = await this.federation.getTransferVoteId(1, '0x02', '0x03', receiver, 1001);
        
        assert.equal(voteid, voteid2);
        assert.notEqual(voteid, voteid3);
    });
    
    it('get transfer no. votes zero', async function () {
        const novotes = await this.federation.getTransferNoVotes(1, '0x02', '0x03', receiver, 1000);
        
        assert.equal(novotes, 0);
    });
    
    it('vote transfer', async function () {
        await this.federation.voteTransfer(1, '0x02', '0x03', receiver, 1000, { from: federators[0] });

        const novotes = await this.federation.getTransferNoVotes(1, '0x02', '0x03', receiver, 1000);
        
        assert.equal(novotes, 1);
        
        const votes = await this.federation.getTransferVotes(1, '0x02', '0x03', receiver, 1000);
        
        assert.ok(votes);
        assert.ok(Array.isArray(votes));
        assert.equal(votes.length, 1);
        assert.equal(votes[0], federators[0]);
    });
    
    it('only member can vote transfer', async function () {
        expectThrow(this.federation.voteTransfer(1, '0x02', '0x03', receiver, 1000, { from: nonmember }));

        const novotes = await this.federation.getTransferNoVotes(1, '0x02', '0x03', receiver, 1000);
        
        assert.equal(novotes, 0);
        
        const votes = await this.federation.getTransferVotes(1, '0x02', '0x03', receiver, 1000);
        
        assert.ok(votes);
        assert.ok(Array.isArray(votes));
        assert.equal(votes.length, 0);
    });
});

