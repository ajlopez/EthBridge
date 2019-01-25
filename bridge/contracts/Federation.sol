pragma solidity ^0.4.24;

import "./Ballot.sol";

contract Federation {
    address[] federators;
    Ballot public ballot;
    
    constructor(address[] memory _federators) public {
        federators = _federators;
        ballot = new Ballot();
    }
    
    function size() public view returns (uint) {
        return federators.length;
    }
    
    function isFederator(address account) public view returns (bool) {
        for (uint16 k = 0; k < federators.length; k++)
            if (federators[k] == account)
                return true;
                
        return false;
    }
    
    modifier onlyMember() {
        require(isFederator(msg.sender));
        _;
    }

    function voteTransfer(uint _blockNumber, bytes32 _blockHash, bytes32 _transactionHash, address _receiver, uint _amount) public onlyMember {
        bytes32 id = getTransferVoteId(_blockNumber, _blockHash, _transactionHash, _receiver, _amount);
        
        ballot.voteProposal(id, msg.sender);
    }
    
    function getTransferNoVotes(uint _blockNumber, bytes32 _blockHash, bytes32 _transactionHash, address _receiver, uint _amount) view public returns (uint) {
        bytes32 id = getTransferVoteId(_blockNumber, _blockHash, _transactionHash, _receiver, _amount);
        
        return ballot.proposalVotes(id).length;
    }
    
    function getTransferVotes(uint _blockNumber, bytes32 _blockHash, bytes32 _transactionHash, address _receiver, uint _amount) view public returns (address[]) {
        bytes32 id = getTransferVoteId(_blockNumber, _blockHash, _transactionHash, _receiver, _amount);
        
        return ballot.proposalVotes(id);
    }
    
    function getTransferVoteId(uint _blockNumber, bytes32 _blockHash, bytes32 _transactionHash, address _receiver, uint _amount)
        public pure returns(bytes32)
    {
        return keccak256(abi.encodePacked(_blockNumber, _blockHash, _transactionHash, _receiver, _amount));
    }    
}

