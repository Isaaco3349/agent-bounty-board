const hre = require("hardhat");
const fs = require("fs");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with:", deployer.address);
  console.log("Balance:", hre.ethers.formatEther(await hre.ethers.provider.getBalance(deployer.address)), "STT");

  // 1. Deploy Escrow
  const Escrow = await hre.ethers.getContractFactory("Escrow");
  const escrow = await Escrow.deploy();
  await escrow.waitForDeployment();
  console.log("Escrow deployed:", await escrow.getAddress());

  // 2. Deploy AgentRegistry
  const AgentRegistry = await hre.ethers.getContractFactory("AgentRegistry");
  const registry = await AgentRegistry.deploy();
  await registry.waitForDeployment();
  console.log("AgentRegistry deployed:", await registry.getAddress());

  // 3. Deploy BountyBoard
  const BountyBoard = await hre.ethers.getContractFactory("BountyBoard");
  const board = await BountyBoard.deploy(await escrow.getAddress(), await registry.getAddress());
  await board.waitForDeployment();
  console.log("BountyBoard deployed:", await board.getAddress());

  // 4. Wire up permissions
  await escrow.setBountyBoard(await board.getAddress());
  await registry.setBountyBoard(await board.getAddress());
  console.log("Permissions set.");

  // 5. Save addresses
  const addresses = {
    network: hre.network.name,
    chainId: 50312,
    BountyBoard: await board.getAddress(),
    Escrow: await escrow.getAddress(),
    AgentRegistry: await registry.getAddress(),
    deployedAt: new Date().toISOString(),
  };

  fs.writeFileSync("../deployed-addresses.json", JSON.stringify(addresses, null, 2));
  console.log("\nAddresses saved to deployed-addresses.json");
  console.log(JSON.stringify(addresses, null, 2));
}

main().catch((e) => { console.error(e); process.exit(1); });
