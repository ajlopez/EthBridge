pragma solidity ^0.4.24;

import "./Bridge.sol";

contract BasicBridgeManager {
    address owner;
    Bridge bridge;
    
    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }
    
    constructor() public {
        owner = msg.sender;
    }
    
    function setBridge(Bridge _bridge) public onlyOwner {
        bridge = _bridge;
    }
    
    function transferTo(address receiver, uint amount) public onlyOwner {
        bridge.transferTo(receiver, amount);
    }
}

