import hardhat from "hardhat";
const { ethers } = hardhat;


async function main() {
  console.log("🚀 Deploying PiggyBank to Hedera Testnet via RPC...");

  const PiggyBank = await ethers.getContractFactory("PiggyBank");
  const contract = await PiggyBank.deploy(); // constructor has no params

  console.log("⏳ Waiting for deployment tx to be mined...");
  await contract.waitForDeployment();

  const contractAddress = await contract.getAddress();

  console.log("✅ Contract deployed!");
  console.log(`📍 Address: ${contractAddress}`);
  console.log(`🌐 Network: Hedera Testnet via Hashio RPC`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});



