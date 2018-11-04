pragma solidity ^0.4.24;

contract Ballot {
    mapping (bytes32 => address[]) votes;
    
    function proposalVotes(bytes32 _proposalId) public view returns (address[]) {
        return votes[_proposalId];
    }
    
    function voteProposal(bytes32 _proposalId, address _voter) {
        address[] storage proposalVotes = votes[_proposalId];
        uint nvotes = proposalVotes.length;
        
        for (uint k = 0; k < nvotes; k++)
            if (_voter == proposalVotes[k])
                return;

        proposalVotes.push(_voter);
    }

    function acceptProposal(bytes32 _proposalId) {
        delete votes[_proposalId];
    }
}

