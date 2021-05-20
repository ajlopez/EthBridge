pragma solidity ^0.6.0;

import '@openzeppelin/contracts/access/Ownable.sol';

contract CryptoVault is Ownable {
    address manager;
    uint nreleases;
    uint nlocks;

    event Lock(address sender, uint nlock, uint amount);
    event Release(address receiver, uint nrelease, uint amount);
    
    modifier onlyManager() {
        require(msg.sender == manager);
        _;
    }
    
    constructor(address _manager) public {
        manager = _manager;
    }
    
    function transferTo(address payable receiver, uint amount) public onlyManager {
        receiver.transfer(amount);
        emit Release(receiver, ++nreleases, amount);
    }
}

