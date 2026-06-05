// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
import "forge-std/Script.sol";
import "../src/BountyBoard.sol";
import "../src/Escrow.sol";
contract Deploy is Script {
    function run() external {
        vm.startBroadcast();
        BountyBoard board = new BountyBoard(
            address(0xe184DBF4a1384F31c240Eb71d91B969496B17321),
            address(0x296Da3211Ab363483a66eFD97e3B47264C91e7eD)
        );
        Escrow escrow = Escrow(0xe184DBF4a1384F31c240Eb71d91B969496B17321);
        escrow.setBountyBoard(address(board));
        vm.stopBroadcast();
    }
}
