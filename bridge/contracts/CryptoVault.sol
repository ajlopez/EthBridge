pragma solidity ^0.6.0;

import '@openzeppelin/contracts/access/Ownable.sol';

contract CryptoVault is Ownable {
    uint nreleases;
    uint nlocks;

    event Lock(address sender, uint nlock, uint amount);
    event Release(address receiver, uint nrelease, uint amount);
    
    constructor() public {
    }
    
    function transferTo(address payable receiver, uint amount) public {
        receiver.transfer(amount);
        emit Release(receiver, ++nreleases, amount);
    }
}

