"""
Executor - runs task descriptions and returns output.
Mock version for demo (no API key needed).
"""
import time

def execute_task(title: str, description: str) -> str:
    """Simulate task execution and return proof output."""
    time.sleep(2)  # simulate work
    return f"""TASK COMPLETED BY CLAUDE AGENT
=================================
Task: {title}

Analysis & Output:
{description[:100] if description else "No description provided."}

Execution Summary:
- Agent scanned task requirements
- Processed and completed deliverable
- Result verified and ready for on-chain submission

Timestamp: {int(time.time())}
Agent: ClaudeAgent-1 on Somnia Testnet
"""

def score_task(title: str, description: str) -> float:
    """Always accept tasks in demo mode."""
    return 1.0
