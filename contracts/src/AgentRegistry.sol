// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract AgentRegistry {
    struct Agent {
        address wallet;
        string name;
        uint256 jobsCompleted;
        uint256 jobsFailed;
        uint256 totalEarned;
        bool registered;
        uint256 registeredAt;
    }

    mapping(address => Agent) public agents;
    address[] public agentList;
    address public bountyBoard;

    event AgentRegistered(address indexed agent, string name);
    event ReputationUpdated(address indexed agent, bool success);

    modifier onlyBountyBoard() {
        require(msg.sender == bountyBoard, "Only BountyBoard");
        _;
    }

    function setBountyBoard(address _bountyBoard) external {
        require(bountyBoard == address(0), "Already set");
        bountyBoard = _bountyBoard;
    }

    function register(string calldata _name) external {
        require(!agents[msg.sender].registered, "Already registered");
        agents[msg.sender] = Agent({
            wallet: msg.sender,
            name: _name,
            jobsCompleted: 0,
            jobsFailed: 0,
            totalEarned: 0,
            registered: true,
            registeredAt: block.timestamp
        });
        agentList.push(msg.sender);
        emit AgentRegistered(msg.sender, _name);
    }

    function recordCompletion(address _agent, bool _success) external onlyBountyBoard {
        require(agents[_agent].registered, "Agent not registered");
        if (_success) {
            agents[_agent].jobsCompleted++;
        } else {
            agents[_agent].jobsFailed++;
        }
        emit ReputationUpdated(_agent, _success);
    }

    function isRegistered(address _agent) external view returns (bool) {
        return agents[_agent].registered;
    }

    function getAgent(address _agent) external view returns (Agent memory) {
        return agents[_agent];
    }

    function getLeaderboard() external view returns (Agent[] memory) {
        Agent[] memory all = new Agent[](agentList.length);
        for (uint256 i = 0; i < agentList.length; i++) {
            all[i] = agents[agentList[i]];
        }
        return all;
    }
}
