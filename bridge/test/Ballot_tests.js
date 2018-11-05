const Ballot = artifacts.require('./Ballot');
const util = require('util');

const expectThrow = require('./utils').expectThrow;

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
    
    it('only ballot owner can vote', async function () {
        expectThrow(this.ballot.voteProposal(1, accounts[0], { from: accounts[1] }));
        
        const votes = await this.ballot.proposalVotes(1);
        
        assert.ok(Array.isArray(votes));
        assert.equal(votes.length, 0);
    });
    
    it('two votes for proposal', async function () {
        await this.ballot.voteProposal(1, accounts[0]);
        await this.ballot.voteProposal(1, accounts[1]);
        
        const votes = await this.ballot.proposalVotes(1);
        
        assert.ok(Array.isArray(votes));
        assert.equal(votes.length, 2);
        assert.equal(votes[0], accounts[0]);
        assert.equal(votes[1], accounts[1]);
    });
    
    it('two repeated votes for proposal', async function () {
        await this.ballot.voteProposal(1, accounts[0]);
        await this.ballot.voteProposal(1, accounts[0]);
        
        const votes = await this.ballot.proposalVotes(1);
        
        assert.ok(Array.isArray(votes));
        assert.equal(votes.length, 1);
        assert.equal(votes[0], accounts[0]);
    });
    
    it('two votes for two proposals', async function () {
        await this.ballot.voteProposal(1, accounts[0]);
        await this.ballot.voteProposal(2, accounts[1]);
        
        const votes1 = await this.ballot.proposalVotes(1);
        const votes2 = await this.ballot.proposalVotes(2);
        
        assert.ok(Array.isArray(votes1));
        assert.equal(votes1.length, 1);
        assert.equal(votes1[0], accounts[0]);
        
        assert.ok(Array.isArray(votes2));
        assert.equal(votes2.length, 1);
        assert.equal(votes2[0], accounts[1]);
        
        var closed1 = await this.ballot.proposalClosed(1);
        assert.ok(!closed1);
        
        var closed2 = await this.ballot.proposalClosed(2);
        assert.ok(!closed2);
    });

    it('two votes for proposal and mark it as accepted', async function () {
        await this.ballot.voteProposal(1, accounts[0]);
        await this.ballot.voteProposal(1, accounts[1]);
        await this.ballot.acceptProposal(1);
        
        const votes = await this.ballot.proposalVotes(1);
        
        assert.ok(Array.isArray(votes));
        assert.equal(votes.length, 0);
        
        const closed = await this.ballot.proposalClosed(1);
        assert.ok(closed);
    });
    
    it('no vote is accepted after proposal was accepted', async function () {
        await this.ballot.voteProposal(1, accounts[0]);
        await this.ballot.acceptProposal(1);
        await this.ballot.voteProposal(1, accounts[1]);
        
        const votes = await this.ballot.proposalVotes(1);
        
        assert.ok(Array.isArray(votes));
        assert.equal(votes.length, 0);
        
        const closed = await this.ballot.proposalClosed(1);
        assert.ok(closed);
    });
});

