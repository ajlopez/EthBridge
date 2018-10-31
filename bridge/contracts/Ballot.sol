pragma solidity ^0.4.24;

contract Ballot {
    mapping (bytes32 => address[]) votes;
    
    function proposalVotes(bytes32 _proposalId) public view returns (address[]) {
        return votes[_proposalId];
    }
    
    function voteProposal(bytes32 _proposalId, address _voter) {
        votes[_proposalId].push(_voter);
    }
}

