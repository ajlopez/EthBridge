pragma solidity ^0.4.24;

contract Bridge {
    address manager;

    event Release(address receiver, uint amount);
    
    modifier onlyManager() {
        require(msg.sender == manager);
        _;
    }
    
    constructor(address _manager) payable public {
        manager = _manager;
    }
    
    function transferTo(address receiver, uint amount) public onlyManager {
        receiver.transfer(amount);
        emit Release(receiver, amount);
    }
}

