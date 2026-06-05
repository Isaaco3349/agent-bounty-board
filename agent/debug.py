from web3 import Web3
import json, os
from dotenv import load_dotenv
load_dotenv()

w3 = Web3(Web3.HTTPProvider("https://dream-rpc.somnia.network"))
account = w3.eth.account.from_key(os.getenv("AGENT_PRIVATE_KEY"))

with open("abis/BountyBoard.json") as f:
    abi = json.load(f)

board = w3.eth.contract(address="0x87899715181E239392E67fe558D6B9c5F5806e8C", abi=abi)

# Try to estimate gas - this will show the revert reason
try:
    gas = board.functions.claimTask(2).estimate_gas({"from": account.address})
    print(f"Estimated gas: {gas}")
except Exception as e:
    print(f"REVERT REASON: {e}")
