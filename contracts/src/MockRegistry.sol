// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
contract AgentRegistry {
    function isRegistered(address agent) external pure returns (bool) { return true; }
    function recordCompletion(address agent, bool success) external {}
}
