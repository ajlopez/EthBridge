pragma solidity ^0.6.0;

import '@openzeppelin/contracts/access/Ownable.sol';

contract CryptoVault is Ownable {
    uint nreleases;
    uint nlocks;

    event Lock(address sender, address receiver, uint nlock, uint amount);
    event Release(address receiver, uint nrelease, uint amount);
    
    constructor() public {
    }
    
    function lockValue(address receiver) public payable {
        emit Lock(msg.sender, receiver, nlocks++, msg.value);
    }
}

