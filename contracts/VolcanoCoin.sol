// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract VolcanoCoin is ERC20, Ownable {
    struct Payment {
        uint256 transferAmount;
        address recipient;
    }

    mapping(address => Payment[]) public payments;

    event IncreaseTotalSupply(uint256 amount);

    constructor() ERC20("VolcanoCoin", "VLC") {
        _mint(msg.sender, 10000 ether);
    }

    function increaseTotalSupply() public onlyOwner {
        _mint(msg.sender, 1000 ether);
        uint256 newTotalSupply = totalSupply();
        emit IncreaseTotalSupply(newTotalSupply);
    }

    function _afterTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal override {
        payments[from].push(Payment(amount, to));
    }
}
