// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
import "forge-std/Script.sol";
import "../src/BountyBoard.sol";
import "../src/Escrow.sol";
contract Deploy is Script {
    function run() external {
        vm.startBroadcast();
        BountyBoard board = new BountyBoard(
            address(0x177eBC671562e6F3c2f8E2D16FD3AFAac9144C74),
            address(0x8C8Aa3a4aD538985438EFDFaDccdac8beBE63fDb)
        );
        Escrow escrow = Escrow(0x177eBC671562e6F3c2f8E2D16FD3AFAac9144C74);
        escrow.setBountyBoard(address(board));
        vm.stopBroadcast();
    }
}
