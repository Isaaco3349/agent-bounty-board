import { defineChain } from "viem";

// Somnia Shannon Testnet
export const somnia = defineChain({
  id: 50312,
  name: "Somnia Shannon",
  nativeCurrency: { name: "STT", symbol: "STT", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://dream-rpc.somnia.network"] },
  },
  blockExplorers: {
    default: { name: "Somnia Explorer", url: "https://shannon-explorer.somnia.network" },
  },
  testnet: true,
});

// Update these after running deploy.js
export const CONTRACT_ADDRESSES = {
  BountyBoard: (process.env.NEXT_PUBLIC_BOUNTY_BOARD_ADDRESS || "0x0000000000000000000000000000000000000000") as `0x${string}`,
  AgentRegistry: (process.env.NEXT_PUBLIC_AGENT_REGISTRY_ADDRESS || "0x0000000000000000000000000000000000000000") as `0x${string}`,
};

export const BOUNTY_BOARD_ABI = [
  {
    "inputs": [
      {"name": "_title", "type": "string"},
      {"name": "_description", "type": "string"},
      {"name": "_category", "type": "string"},
      {"name": "_deadline", "type": "uint256"}
    ],
    "name": "postTask",
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [{"name": "_taskId", "type": "uint256"}],
    "name": "approveTask",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"name": "_taskId", "type": "uint256"}],
    "name": "cancelTask",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getOpenTasks",
    "outputs": [
      {
        "components": [
          {"name": "id", "type": "uint256"},
          {"name": "poster", "type": "address"},
          {"name": "title", "type": "string"},
          {"name": "description", "type": "string"},
          {"name": "category", "type": "string"},
          {"name": "reward", "type": "uint256"},
          {"name": "deadline", "type": "uint256"},
          {"name": "status", "type": "uint8"},
          {"name": "assignedAgent", "type": "address"},
          {"name": "proofCid", "type": "string"}
        ],
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"name": "_taskId", "type": "uint256"}],
    "name": "getTask",
    "outputs": [
      {
        "components": [
          {"name": "id", "type": "uint256"},
          {"name": "poster", "type": "address"},
          {"name": "title", "type": "string"},
          {"name": "description", "type": "string"},
          {"name": "category", "type": "string"},
          {"name": "reward", "type": "uint256"},
          {"name": "deadline", "type": "uint256"},
          {"name": "status", "type": "uint8"},
          {"name": "assignedAgent", "type": "address"},
          {"name": "proofCid", "type": "string"}
        ],
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "taskCount",
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "name": "taskId", "type": "uint256"},
      {"indexed": true, "name": "poster", "type": "address"},
      {"name": "title", "type": "string"},
      {"name": "reward", "type": "uint256"},
      {"name": "deadline", "type": "uint256"}
    ],
    "name": "TaskPosted",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "name": "taskId", "type": "uint256"},
      {"indexed": true, "name": "agent", "type": "address"},
      {"name": "ipfsCid", "type": "string"}
    ],
    "name": "ProofSubmitted",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "name": "taskId", "type": "uint256"},
      {"indexed": true, "name": "agent", "type": "address"},
      {"name": "reward", "type": "uint256"}
    ],
    "name": "TaskCompleted",
    "type": "event"
  }
] as const;
