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
}

