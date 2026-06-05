export const BOUNTY_BOARD_ADDRESS = '0x87899715181E239392E67fe558D6B9c5F5806e8C'
export const ESCROW_ADDRESS = '0x177eBC671562e6F3c2f8E2D16FD3AFAac9144C74'
export const AGENT_REGISTRY_ADDRESS = '0x8C8Aa3a4aD538985438EFDFaDccdac8beBE63fDb'

export const BOUNTY_BOARD_ABI = [
  { name: 'taskCount', type: 'function', stateMutability: 'view', inputs: [], outputs: [{ type: 'uint256' }] },
  { name: 'postTask', type: 'function', stateMutability: 'payable', inputs: [{ name: 'title', type: 'string' }, { name: 'description', type: 'string' }, { name: 'category', type: 'string' }, { name: 'deadline', type: 'uint256' }], outputs: [{ type: 'uint256' }] },
  { name: 'claimTask', type: 'function', stateMutability: 'nonpayable', inputs: [{ name: 'taskId', type: 'uint256' }], outputs: [] },
  { name: 'submitProof', type: 'function', stateMutability: 'nonpayable', inputs: [{ name: 'taskId', type: 'uint256' }, { name: 'ipfsCid', type: 'string' }], outputs: [] },
  { name: 'approveTask', type: 'function', stateMutability: 'nonpayable', inputs: [{ name: 'taskId', type: 'uint256' }], outputs: [] },
  { name: 'cancelTask', type: 'function', stateMutability: 'nonpayable', inputs: [{ name: 'taskId', type: 'uint256' }], outputs: [] },
  { name: 'getTask', type: 'function', stateMutability: 'view', inputs: [{ name: 'taskId', type: 'uint256' }], outputs: [{ type: 'tuple', components: [{ name: 'id', type: 'uint256' }, { name: 'poster', type: 'address' }, { name: 'title', type: 'string' }, { name: 'description', type: 'string' }, { name: 'category', type: 'string' }, { name: 'reward', type: 'uint256' }, { name: 'deadline', type: 'uint256' }, { name: 'status', type: 'uint8' }, { name: 'assignedAgent', type: 'address' }, { name: 'proofCid', type: 'string' }] }] },
  { name: 'getOpenTasks', type: 'function', stateMutability: 'view', inputs: [], outputs: [{ type: 'tuple[]', components: [{ name: 'id', type: 'uint256' }, { name: 'poster', type: 'address' }, { name: 'title', type: 'string' }, { name: 'description', type: 'string' }, { name: 'category', type: 'string' }, { name: 'reward', type: 'uint256' }, { name: 'deadline', type: 'uint256' }, { name: 'status', type: 'uint8' }, { name: 'assignedAgent', type: 'address' }, { name: 'proofCid', type: 'string' }] }] },
] as const

export const AGENT_REGISTRY_ABI = [
  { name: 'register', type: 'function', stateMutability: 'nonpayable', inputs: [{ name: 'name', type: 'string' }], outputs: [] },
  { name: 'isRegistered', type: 'function', stateMutability: 'view', inputs: [{ name: 'agent', type: 'address' }], outputs: [{ type: 'bool' }] },
  { name: 'getAgent', type: 'function', stateMutability: 'view', inputs: [{ name: 'agent', type: 'address' }], outputs: [{ type: 'tuple', components: [{ name: 'wallet', type: 'address' }, { name: 'name', type: 'string' }, { name: 'jobsCompleted', type: 'uint256' }, { name: 'jobsFailed', type: 'uint256' }, { name: 'totalEarned', type: 'uint256' }, { name: 'registered', type: 'bool' }, { name: 'registeredAt', type: 'uint256' }] }] },
  { name: 'getLeaderboard', type: 'function', stateMutability: 'view', inputs: [], outputs: [{ type: 'tuple[]', components: [{ name: 'wallet', type: 'address' }, { name: 'name', type: 'string' }, { name: 'jobsCompleted', type: 'uint256' }, { name: 'jobsFailed', type: 'uint256' }, { name: 'totalEarned', type: 'uint256' }, { name: 'registered', type: 'bool' }, { name: 'registeredAt', type: 'uint256' }] }] },
] as const