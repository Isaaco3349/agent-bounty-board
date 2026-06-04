// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./Escrow.sol";
import "./AgentRegistry.sol";

contract BountyBoard {
    enum TaskStatus { Open, Claimed, PendingReview, Completed, Cancelled }

    struct Task {
        uint256 id;
        address poster;
        string title;
        string description;
        string category;
        uint256 reward;
        uint256 deadline;
        TaskStatus status;
        address assignedAgent;
        string proofCid;
    }

    uint256 public taskCount;
    mapping(uint256 => Task) public tasks;

    Escrow public escrow;
    AgentRegistry public registry;

    event TaskPosted(uint256 indexed taskId, address indexed poster, string title, uint256 reward, uint256 deadline);
    event TaskClaimed(uint256 indexed taskId, address indexed agent);
    event ProofSubmitted(uint256 indexed taskId, address indexed agent, string ipfsCid);
    event TaskCompleted(uint256 indexed taskId, address indexed agent, uint256 reward);
    event TaskCancelled(uint256 indexed taskId);

    constructor(address _escrow, address _registry) {
        escrow = Escrow(_escrow);
        registry = AgentRegistry(_registry);
    }

    function postTask(
        string calldata _title,
        string calldata _description,
        string calldata _category,
        uint256 _deadline
    ) external payable returns (uint256) {
        require(msg.value > 0, "Reward must be > 0");
        require(_deadline > block.timestamp, "Deadline must be in future");

        taskCount++;
        uint256 taskId = taskCount;

        tasks[taskId] = Task({
            id: taskId,
            poster: msg.sender,
            title: _title,
            description: _description,
            category: _category,
            reward: msg.value,
            deadline: _deadline,
            status: TaskStatus.Open,
            assignedAgent: address(0),
            proofCid: ""
        });

        escrow.lockFunds{value: msg.value}(taskId, msg.sender);

        emit TaskPosted(taskId, msg.sender, _title, msg.value, _deadline);
        return taskId;
    }

    function claimTask(uint256 _taskId) external {
        Task storage task = tasks[_taskId];
        require(task.status == TaskStatus.Open, "Task not open");
        require(block.timestamp < task.deadline, "Task expired");
        require(registry.isRegistered(msg.sender), "Agent not registered");

        task.status = TaskStatus.Claimed;
        task.assignedAgent = msg.sender;

        emit TaskClaimed(_taskId, msg.sender);
    }

    function submitProof(uint256 _taskId, string calldata _ipfsCid) external {
        Task storage task = tasks[_taskId];
        require(task.assignedAgent == msg.sender, "Not assigned agent");
        require(task.status == TaskStatus.Claimed, "Task not claimed");

        task.proofCid = _ipfsCid;
        task.status = TaskStatus.PendingReview;

        emit ProofSubmitted(_taskId, msg.sender, _ipfsCid);
    }

    function approveTask(uint256 _taskId) external {
        Task storage task = tasks[_taskId];
        require(task.poster == msg.sender, "Not task poster");
        require(task.status == TaskStatus.PendingReview, "Not pending review");

        task.status = TaskStatus.Completed;
        escrow.releaseFunds(_taskId, task.assignedAgent);
        registry.recordCompletion(task.assignedAgent, true);

        emit TaskCompleted(_taskId, task.assignedAgent, task.reward);
    }

    function cancelTask(uint256 _taskId) external {
        Task storage task = tasks[_taskId];
        require(task.poster == msg.sender, "Not task poster");
        require(task.status == TaskStatus.Open, "Can only cancel open tasks");

        task.status = TaskStatus.Cancelled;
        escrow.refundFunds(_taskId, task.poster);

        emit TaskCancelled(_taskId);
    }

    function getTask(uint256 _taskId) external view returns (Task memory) {
        return tasks[_taskId];
    }

    function getOpenTasks() external view returns (Task[] memory) {
        uint256 count = 0;
        for (uint256 i = 1; i <= taskCount; i++) {
            if (tasks[i].status == TaskStatus.Open) count++;
        }
        Task[] memory open = new Task[](count);
        uint256 idx = 0;
        for (uint256 i = 1; i <= taskCount; i++) {
            if (tasks[i].status == TaskStatus.Open) {
                open[idx++] = tasks[i];
            }
        }
        return open;
    }
}
