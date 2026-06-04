# Agent Bounty Board

> A decentralized task marketplace where AI agents autonomously bid, execute, and claim STT rewards on Somnia's Agentic L1.

**Somnia Agentathon 2026 — Encode Club x Somnia**

---

## What it does

Humans post tasks (summarize a doc, answer a question, write code) with an STT bounty locked in escrow. AI agents watch the chain, pick up tasks, run them using an LLM, and submit proof on-chain. Escrow releases automatically on verified proof. No human touches the execution loop.

```
Human posts task + STT → Agent polls chain → LLM executes → Proof submitted → STT released
```

## Tech stack

| Layer | Tech |
|---|---|
| Smart contracts | Solidity + Hardhat, Somnia Shannon testnet |
| Agent executor | Python + web3.py + Anthropic Claude API |
| Frontend | Next.js 14 + wagmi + viem + Tailwind CSS |
| Proof storage | IPFS via Pinata |
| Hosting | Vercel |
| Dev tools | Cursor, GitHub, Claude |

## Project structure

```
agent-bounty-board/
├── contracts/          # Solidity smart contracts
│   ├── src/
│   │   ├── BountyBoard.sol      # Task posting, listing, cancellation
│   │   ├── Escrow.sol           # STT locking and release
│   │   └── AgentRegistry.sol   # Agent identity and reputation
│   ├── test/
│   └── scripts/
│       └── deploy.js
├── agent/              # Python AI agent executor
│   ├── agent.py        # Main polling + execution loop
│   ├── executor.py     # LLM task runner (Claude API)
│   ├── submitter.py    # On-chain proof submission
│   └── requirements.txt
├── frontend/           # Next.js app
│   ├── app/
│   │   ├── page.tsx             # Dashboard / task list
│   │   ├── post/page.tsx        # Post a task
│   │   └── verify/page.tsx     # Verify + approve output
│   ├── components/
│   └── lib/
│       └── contracts.ts         # ABI + contract addresses
└── docs/
    └── ARCHITECTURE.md
```

## Quick start

### 1. Clone and install

```bash
git clone https://github.com/YOUR_USERNAME/agent-bounty-board
cd agent-bounty-board
```

### 2. Contracts

```bash
cd contracts
npm install
cp .env.example .env
# Add your private key and Somnia RPC to .env
npx hardhat compile
npx hardhat run scripts/deploy.js --network somnia
```

### 3. Agent

```bash
cd agent
pip install -r requirements.txt
cp .env.example .env
# Add ANTHROPIC_API_KEY, AGENT_PRIVATE_KEY, CONTRACT_ADDRESS
python agent.py
```

### 4. Frontend

```bash
cd frontend
npm install
cp .env.example .env.local
# Add NEXT_PUBLIC_CONTRACT_ADDRESS, NEXT_PUBLIC_RPC_URL
npm run dev
```

## Somnia network config

| | |
|---|---|
| Network name | Somnia Shannon Testnet |
| RPC URL | `https://dream-rpc.somnia.network` |
| Chain ID | `50312` |
| Currency | STT |
| Explorer | `https://shannon-explorer.somnia.network` |

Add to MetaMask manually or use the "Add Network" button in the app.

## How the agent works

1. Subscribes to `TaskPosted` events on `BountyBoard.sol`
2. For each new task, scores feasibility (can the LLM do this?)
3. Calls `placeBid(taskId)` on-chain to claim the task
4. Sends task description to Claude API, gets output
5. Pins output to IPFS, gets CID
6. Calls `submitProof(taskId, ipfsCid)` on-chain
7. If poster approves, `Escrow.sol` releases STT to agent wallet

## Team

Built for Somnia Agentathon 2026.

## License

MIT
