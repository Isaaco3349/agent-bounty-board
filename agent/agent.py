"""
Agent Bounty Board — AI Agent Executor
Polls Somnia for open tasks, executes them with Claude, submits proof on-chain.
"""

import os
import time
import json
import logging
from web3 import Web3
from dotenv import load_dotenv
from executor import execute_task
from submitter import submit_proof, claim_task, register_agent

load_dotenv()
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
log = logging.getLogger(__name__)

RPC_URL = os.getenv("SOMNIA_RPC_URL", "https://dream-rpc.somnia.network")
PRIVATE_KEY = os.getenv("AGENT_PRIVATE_KEY")
AGENT_NAME = os.getenv("AGENT_NAME", "ClaudeAgent-1")
POLL_INTERVAL = int(os.getenv("POLL_INTERVAL", "10"))

with open("../deployed-addresses.json") as f:
    addresses = json.load(f)

with open("abis/BountyBoard.json") as f:
    BOARD_ABI = json.load(f)

w3 = Web3(Web3.HTTPProvider(RPC_URL))
account = w3.eth.account.from_key(PRIVATE_KEY)
board = w3.eth.contract(address=addresses["BountyBoard"], abi=BOARD_ABI)

log.info(f"Agent wallet: {account.address}")
log.info(f"Connected to Somnia: {w3.is_connected()}")

def run():
    # Register agent if not already registered
    register_agent(w3, account, addresses, AGENT_NAME)

    processed = set()
    log.info(f"Polling for tasks every {POLL_INTERVAL}s...")

    while True:
        try:
            open_tasks = board.functions.getOpenTasks().call()
            log.info(f"Found {len(open_tasks)} open tasks")

            for task in open_tasks:
                task_id = task[0]
                if task_id in processed:
                    continue

                title = task[2]
                description = task[3]
                reward_wei = task[5]
                reward_stt = w3.from_wei(reward_wei, "ether")

                log.info(f"Task #{task_id}: '{title}' — reward: {reward_stt} STT")

                # Claim the task
                claimed = claim_task(w3, account, board, addresses, task_id)
                if not claimed:
                    log.warning(f"Could not claim task #{task_id}, skipping")
                    continue

                # Execute with Claude
                log.info(f"Executing task #{task_id}...")
                output = execute_task(title, description)
                log.info(f"Execution complete. Output length: {len(output)} chars")

                # Submit proof
                cid = submit_proof(w3, account, board, addresses, task_id, output)
                log.info(f"Proof submitted. IPFS CID: {cid}")

                processed.add(task_id)

        except Exception as e:
            log.error(f"Loop error: {e}")

        time.sleep(POLL_INTERVAL)

if __name__ == "__main__":
    run()
