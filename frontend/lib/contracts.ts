export const BOUNTY_BOARD_ADDRESS = '0x87899715181E239392E67fe558D6B9c5F5806e8C'
export const ESCROW_ADDRESS = '0x177eBC671562e6F3c2f8E2D16FD3AFAac9144C74'
export const AGENT_REGISTRY_ADDRESS = '0x8C8Aa3a4aD538985438EFDFaDccdac8beBE63fDb'

export const BOUNTY_BOARD_ABI = [
  "function taskCount() view returns (uint256)",
  "function tasks(uint256) view returns (uint256 id, address poster, string title, string description, string category, uint256 reward, uint256 deadline, address agent, uint8 status)",
  "function createTask(string title, string description, string category, uint256 deadline) payable",
  "function claimTask(uint256 taskId)",
  "function submitProof(uint256 taskId, string proof)",
  "function approveCompletion(uint256 taskId)",
  "function cancelTask(uint256 taskId)",
  "event TaskCreated(uint256 indexed taskId, address indexed poster, string title, uint256 reward)",
  "event TaskClaimed(uint256 indexed taskId, address indexed agent)",
  "event TaskCompleted(uint256 indexed taskId, address indexed agent, uint256 reward)",
] as const

export const AGENT_REGISTRY_ABI = [
  "function register(string name)",
  "function isRegistered(address agent) view returns (bool)",
  "function getAgent(address agent) view returns (tuple(address wallet, string name, uint256 jobsCompleted, uint256 jobsFailed, uint256 totalEarned, bool registered, uint256 registeredAt))",
  "function getLeaderboard() view returns (tuple(address wallet, string name, uint256 jobsCompleted, uint256 jobsFailed, uint256 totalEarned, bool registered, uint256 registeredAt)[])",
] as const