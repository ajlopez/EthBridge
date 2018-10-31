const Ballot = artifacts.require('./Ballot');
const util = require('util');

contract('Ballot', function (accounts) {
    beforeEach(async function () {
        this.ballot = await Ballot.new();
    });
    
    it('no votes for unknown proposal', async function () {
        const votes = await this.ballot.proposalVotes(1);
        
        assert.ok(Array.isArray(votes));
        assert.equal(votes.length, 0);
    });
    
    it('one vote for proposal', async function () {
        await this.ballot.voteProposal(1, accounts[0]);
        
        const votes = await this.ballot.proposalVotes(1);
        
        assert.ok(Array.isArray(votes));
        assert.equal(votes.length, 1);
        assert.equal(votes[0], accounts[0]);
    });
});

