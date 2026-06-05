// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/BountyBoard.sol";

contract Deploy is Script {
    function run() external {
        vm.startBroadcast();
        new BountyBoard(
            address(0x0000000000000000000000000000000000000001),
            address(0x0000000000000000000000000000000000000001)
        );
        vm.stopBroadcast();
    }
}