pragma solidity ^0.4.24;

contract Ballot {
    mapping (bytes32 => address[]) votes;
    
    function proposalVotes(bytes32 _proposalId) view returns (address[]) {
    }
}