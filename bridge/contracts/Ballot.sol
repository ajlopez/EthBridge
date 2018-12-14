pragma solidity ^0.4.24;

contract Ballot {
    address owner;
    mapping (bytes32 => address[]) votes;
    mapping (bytes32 => bool) accepted;
    mapping (bytes32 => bool) canceled;
    
    constructor() public {
        owner = msg.sender;
    }
    
    modifier onlyOwner() {
        require(owner == msg.sender);
        _;
    }
    
    function proposalVotes(bytes32 _proposalId) public view returns (address[]) {
        return votes[_proposalId];
    }
    
    function voteProposal(bytes32 _proposalId, address _voter) public onlyOwner {
        if (accepted[_proposalId])
            return;
            
        address[] storage propVotes = votes[_proposalId];
        uint nvotes = propVotes.length;
        
        for (uint k = 0; k < nvotes; k++)
            if (_voter == propVotes[k])
                return;

        propVotes.push(_voter);
    }

    function acceptProposal(bytes32 _proposalId) public onlyOwner {
        delete votes[_proposalId];
        accepted[_proposalId] = true;
    }
    
    function proposalAccepted(bytes32 _proposalId) public view returns (bool) {
        return accepted[_proposalId];
    }

    function cancelProposal(bytes32 _proposalId) public onlyOwner {
        delete votes[_proposalId];
        canceled[_proposalId] = true;
    }
    
    function proposalCanceled(bytes32 _proposalId) public view returns (bool) {
        return canceled[_proposalId];
    }
}

