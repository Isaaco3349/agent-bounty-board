// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
contract Escrow {
    function lockFunds(uint256 taskId, address poster) external payable {}
    function releaseFunds(uint256 taskId, address agent) external {}
    function refundFunds(uint256 taskId, address poster) external {}
}
