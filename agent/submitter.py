"""
Submitter — handles all on-chain writes: register, claim, submit proof.
"""

import os
import json
import logging
import requests
from web3 import Web3

log = logging.getLogger(__name__)

PINATA_JWT = os.getenv("PINATA_JWT")


def build_and_send(w3: Web3, account, fn, gas=2_000_000):
    """Build, sign, and send a transaction. Returns receipt."""
    nonce = w3.eth.get_transaction_count(account.address, 'pending')
    tx = fn.build_transaction({
        "from": account.address,
        "nonce": nonce,
        "gas": gas,
        "gasPrice": w3.to_wei('6', 'gwei'),
    })
    signed = account.sign_transaction(tx)
    tx_hash = w3.eth.send_raw_transaction(signed.raw_transaction)
    receipt = w3.eth.wait_for_transaction_receipt(tx_hash, timeout=60)
    return receipt


def register_agent(w3: Web3, account, addresses: dict, name: str):
    with open("abis/AgentRegistry.json") as f:
        abi = json.load(f)
    registry = w3.eth.contract(address=addresses["AgentRegistry"], abi=abi)

    is_registered = registry.functions.isRegistered(account.address).call()
    if is_registered:
        log.info("Agent already registered.")
        return

    log.info(f"Registering agent as '{name}'...")
    receipt = build_and_send(w3, account, registry.functions.register(name))
    log.info(f"Registered. Tx: {receipt.transactionHash.hex()}")


def claim_task(w3: Web3, account, board, addresses: dict, task_id: int) -> bool:
    try:
        receipt = build_and_send(w3, account, board.functions.claimTask(task_id))
        log.info(f"Claimed task #{task_id}. Tx: {receipt.transactionHash.hex()}")
        return receipt.status == 1
    except Exception as e:
        log.error(f"Claim failed: {e}")
        return False


def pin_to_ipfs(content: str, task_id: int) -> str:
    """Pin output to IPFS via Pinata. Returns CID."""
    if not PINATA_JWT:
        log.warning("No PINATA_JWT set — using placeholder CID")
        return f"bafybeifake{task_id}placeholder"

    url = "https://api.pinata.cloud/pinning/pinJSONToIPFS"
    headers = {"Authorization": f"Bearer {PINATA_JWT}", "Content-Type": "application/json"}
    payload = {
        "pinataContent": {"taskId": task_id, "output": content},
        "pinataMetadata": {"name": f"bounty-task-{task_id}"},
    }
    res = requests.post(url, json=payload, headers=headers)
    res.raise_for_status()
    return res.json()["IpfsHash"]


def submit_proof(w3: Web3, account, board, addresses: dict, task_id: int, output: str) -> str:
    cid = pin_to_ipfs(output, task_id)
    receipt = build_and_send(w3, account, board.functions.submitProof(task_id, cid))
    log.info(f"Proof submitted. Tx: {receipt.transactionHash.hex()}")
    return cid
