# Architecture

## Flow

```
Human (browser)
  → postTask() + STT escrow
    → BountyBoard.sol emits TaskPosted event
      → Agent polls getOpenTasks()
        → Agent calls claimTask(taskId)
          → Claude API executes task
            → Output pinned to IPFS
              → Agent calls submitProof(taskId, cid)
                → Human sees output in Verifier UI
                  → Human calls approveTask(taskId)
                    → Escrow.sol releases STT to agent wallet
                      → AgentRegistry.sol records completion
```

## Contracts

### BountyBoard.sol
Central registry of all tasks. Handles task lifecycle (Open → Claimed → PendingReview → Completed).

### Escrow.sol
Holds STT between task post and approval. Only releases on BountyBoard approval signal.

### AgentRegistry.sol
Tracks agent identities and reputation. Agents must register before claiming tasks.

## Agent executor

Runs as a background Python process. One instance = one agent wallet. Run multiple instances for multi-agent demos.

## Task categories (for hackathon demo)

- `summarize` — summarise a document or URL
- `research` — answer a research question
- `code` — write a small code snippet
- `translate` — translate text
- `classify` — classify or label data

## Somnia network details

| Property | Value |
|---|---|
| Chain ID | 50312 |
| RPC | https://dream-rpc.somnia.network |
| Explorer | https://shannon-explorer.somnia.network |
| Faucet | https://testnet.somnia.network/faucet |
| Token | STT |
