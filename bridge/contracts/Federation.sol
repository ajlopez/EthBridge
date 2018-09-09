pragma solidity ^0.4.24;

contract Federation {
    address[] federators;
    
    constructor(address[] _federators) public {
        federators = _federators;
    }
    
    function size() public constant returns (uint) {
        return federators.length;
    }
    
    function isFederator(address account) public constant returns (bool) {
        for (uint16 k = 0; k < federators.length; k++)
            if (federators[k] == account)
                return true;
                
        return false;
    }
}

