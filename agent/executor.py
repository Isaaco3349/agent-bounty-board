"""
Executor — runs task descriptions through Claude API and returns output.
"""

import os
import anthropic

client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

SYSTEM_PROMPT = """You are an autonomous AI agent executing tasks on the Agent Bounty Board, 
a decentralized task marketplace on Somnia blockchain. 

Your job is to complete the given task accurately and concisely. 
Return ONLY the task output — no preamble, no explanation of what you're doing.
Your output will be stored on IPFS and verified on-chain."""

def execute_task(title: str, description: str) -> str:
    """Run a bounty task through Claude and return the output."""
    prompt = f"""Task title: {title}

Task description:
{description}

Complete this task now. Return only the output."""

    message = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=2048,
        messages=[{"role": "user", "content": prompt}],
        system=SYSTEM_PROMPT,
    )

    return message.content[0].text


def score_task(title: str, description: str) -> float:
    """
    Returns a 0-1 confidence score for whether this agent can handle the task.
    Skip tasks below 0.5.
    """
    prompt = f"""Can you complete this task? Reply with only a number between 0 and 1 
representing your confidence. 1 = definitely yes, 0 = definitely no.

Task: {title}
Description: {description}"""

    message = client.messages.create(
        model="claude-haiku-4-5-20251001",
        max_tokens=10,
        messages=[{"role": "user", "content": prompt}],
    )

    try:
        return float(message.content[0].text.strip())
    except:
        return 0.5
