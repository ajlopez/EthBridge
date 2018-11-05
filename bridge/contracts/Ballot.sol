pragma solidity ^0.4.24;

contract Ballot {
    mapping (bytes32 => address[]) votes;
    mapping (bytes32 => bool) closed;
    
    function proposalVotes(bytes32 _proposalId) public view returns (address[]) {
        return votes[_proposalId];
    }
    
    function voteProposal(bytes32 _proposalId, address _voter) public {
        if (closed[_proposalId])
            return;
            
        address[] storage propVotes = votes[_proposalId];
        uint nvotes = propVotes.length;
        
        for (uint k = 0; k < nvotes; k++)
            if (_voter == propVotes[k])
                return;

        propVotes.push(_voter);
    }

    function acceptProposal(bytes32 _proposalId) public {
        delete votes[_proposalId];
        closed[_proposalId] = true;
    }
    
    function proposalClosed(bytes32 _proposalId) public view returns (bool) {
        return closed[_proposalId];
    }
}

