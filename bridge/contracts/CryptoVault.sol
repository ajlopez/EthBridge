pragma solidity ^0.6.0;

import '@openzeppelin/contracts/access/Ownable.sol';

contract CryptoVault is Ownable {
    uint public lockedValue;
    uint public nlocks;

    event Lock(address sender, address receiver, uint nlock, uint amount);
    event Release(address receiver, uint nrelease, uint amount);
    
    constructor() public {
    }
    
    function lockValue(address receiver) public payable {
        require(msg.value > 0);
        lockedValue += msg.value;
        emit Lock(msg.sender, receiver, nlocks++, msg.value);
    }
}

