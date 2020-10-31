pragma solidity ^0.6.0;

import "./Vault.sol";

contract BasicVaultManager {
    address owner;
    Vault vault;
    
    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }
    
    constructor() public {
        owner = msg.sender;
    }
    
    function setVault(Vault _vault) public onlyOwner {
        vault = _vault;
    }
    
    function transferTo(address payable receiver, uint amount) public onlyOwner {
        vault.transferTo(receiver, amount);
    }
}

