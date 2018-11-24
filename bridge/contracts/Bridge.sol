pragma solidity ^0.4.24;

contract Bridge {
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
    
    function transferTo(address receiver, uint amount) public onlyManager {
        receiver.transfer(amount);
        emit Release(receiver, ++nreleases, amount);
    }
    
    function () public payable {
        emit Lock(msg.sender, ++nlocks, msg.value);
    }
}

