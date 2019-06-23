const Ballot = artifacts.require('./Ballot');
const util = require('util');

const expectThrow = require('./utils').expectThrow;

contract('Ballot', function (accounts) {
    beforeEach(async function () {
        this.ballot = await Ballot.new();
    });
    
    it('no votes for unknown proposal', async function () {
        const votes = await this.ballot.proposalVotes('0x01');
        
        assert.ok(Array.isArray(votes));
        assert.equal(votes.length, 0);
    });
    
    it('one vote for proposal', async function () {
        await this.ballot.voteProposal('0x01', accounts[0]);
        
        const votes = await this.ballot.proposalVotes('0x01');
        
        assert.equal(votes[0], accounts[0]);
    });
    
    it('only ballot owner can vote', async function () {
        expectThrow(this.ballot.voteProposal('0x01', accounts[0], { from: accounts[1] }));
        
        const votes = await this.ballot.proposalVotes('0x01');

        assert.equal(votes[0], null);
    });
    
    it('two votes for proposal', async function () {
        await this.ballot.voteProposal('0x01', accounts[0]);
        await this.ballot.voteProposal('0x01', accounts[1]);
        
        const votes = await this.ballot.proposalVotes('0x01');
        
        assert.equal(votes[0], accounts[0]);
        assert.equal(votes[1], accounts[1]);
    });
    
    it('two repeated votes for proposal', async function () {
        await this.ballot.voteProposal('0x01', accounts[0]);
        await this.ballot.voteProposal('0x01', accounts[0]);
        
        const votes = await this.ballot.proposalVotes('0x01');
        
        assert.equal(votes[0], accounts[0]);
    });
    
    it('two votes for two proposals', async function () {
        await this.ballot.voteProposal('0x01', accounts[0]);
        await this.ballot.voteProposal('0x02', accounts[1]);
        
        const votes1 = await this.ballot.proposalVotes('0x01');
        const votes2 = await this.ballot.proposalVotes('0x02');

        assert.equal(votes1[0], accounts[0]);
        
        assert.equal(votes2[0], accounts[1]);
        
        var accepted1 = await this.ballot.proposalAccepted('0x01');
        assert.ok(!accepted1);
        
        var accepted2 = await this.ballot.proposalAccepted('0x02');
        assert.ok(!accepted2);
    });

    it('two votes for proposal and mark it as accepted', async function () {
        await this.ballot.voteProposal('0x01', accounts[0]);
        await this.ballot.voteProposal('0x01', accounts[1]);
        await this.ballot.acceptProposal('0x01');
        
        const votes = await this.ballot.proposalVotes('0x01');
        
        assert.equal(votes[0], null);
        
        const accepted = await this.ballot.proposalAccepted('0x01');
        assert.ok(accepted);
    });
    
    it('only ballot owner can accept proposal', async function () {
        await this.ballot.voteProposal('0x01', accounts[0]);
        await this.ballot.voteProposal('0x01', accounts[1]);
        expectThrow(this.ballot.acceptProposal('0x01', { from: accounts[2] }));
        
        const votes = await this.ballot.proposalVotes('0x01');
        
        assert.equal(votes[0], accounts[0]);
        assert.equal(votes[1], accounts[1]);
        
        const accepted = await this.ballot.proposalAccepted('0x01');
        assert.ok(!accepted);
    });
    
    it('no vote is accepted after proposal was accepted', async function () {
        await this.ballot.voteProposal('0x01', accounts[0]);
        await this.ballot.acceptProposal('0x01');
        await this.ballot.voteProposal('0x01', accounts[1]);
        
        const votes = await this.ballot.proposalVotes('0x01');
        
        assert.ok(Array.isArray(votes));
        assert.equal(votes.length, 0);
        
        const accepted = await this.ballot.proposalAccepted('0x01');
        assert.ok(accepted);
    });

    it('cancel proposal', async function () {
        await this.ballot.voteProposal('0x01', accounts[0]);
        await this.ballot.cancelProposal('0x01');
        
        const votes = await this.ballot.proposalVotes('0x01');
        
        assert.equal(votes[0], undefined);
        
        const accepted = await this.ballot.proposalAccepted('0x01');
        assert.ok(!accepted);
        
        const canceled = await this.ballot.proposalCanceled('0x01');
        assert.ok(canceled);
    });

    it('no vote is accepted after proposal was canceled', async function () {
        await this.ballot.voteProposal('0x01', accounts[0]);
        await this.ballot.cancelProposal('0x01');
        await this.ballot.voteProposal('0x01', accounts[1]);
        
        const votes = await this.ballot.proposalVotes('0x01');
        
        assert.equal(votes[0], undefined);
        
        const accepted = await this.ballot.proposalAccepted('0x01');
        assert.ok(!accepted);
        
        const canceled = await this.ballot.proposalCanceled('0x01');
        assert.ok(canceled);
    });
});

