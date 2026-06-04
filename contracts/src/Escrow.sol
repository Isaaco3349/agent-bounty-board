// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Escrow {
    address public bountyBoard;

    struct Lock {
        uint256 amount;
        address poster;
        bool released;
    }

    mapping(uint256 => Lock) public locks;

    event FundsLocked(uint256 indexed taskId, address indexed poster, uint256 amount);
    event FundsReleased(uint256 indexed taskId, address indexed agent, uint256 amount);
    event FundsRefunded(uint256 indexed taskId, address indexed poster, uint256 amount);

    modifier onlyBountyBoard() {
        require(msg.sender == bountyBoard, "Only BountyBoard");
        _;
    }

    function setBountyBoard(address _bountyBoard) external {
        require(bountyBoard == address(0), "Already set");
        bountyBoard = _bountyBoard;
    }

    function lockFunds(uint256 _taskId, address _poster) external payable onlyBountyBoard {
        require(msg.value > 0, "No funds sent");
        locks[_taskId] = Lock({amount: msg.value, poster: _poster, released: false});
        emit FundsLocked(_taskId, _poster, msg.value);
    }

    function releaseFunds(uint256 _taskId, address _agent) external onlyBountyBoard {
        Lock storage lock = locks[_taskId];
        require(!lock.released, "Already released");
        require(lock.amount > 0, "No funds locked");

        lock.released = true;
        uint256 amount = lock.amount;
        (bool ok, ) = payable(_agent).call{value: amount}("");
        require(ok, "Transfer failed");

        emit FundsReleased(_taskId, _agent, amount);
    }

    function refundFunds(uint256 _taskId, address _poster) external onlyBountyBoard {
        Lock storage lock = locks[_taskId];
        require(!lock.released, "Already released");
        require(lock.amount > 0, "No funds locked");

        lock.released = true;
        uint256 amount = lock.amount;
        (bool ok, ) = payable(_poster).call{value: amount}("");
        require(ok, "Refund failed");

        emit FundsRefunded(_taskId, _poster, amount);
    }

    function getLock(uint256 _taskId) external view returns (Lock memory) {
        return locks[_taskId];
    }
}
