// scripts/generate-hedera-bytecode.ts
import hre from "hardhat";
import fs from "fs";
import path from "path";

async function main() {
  console.log("🔧 Generating Hedera-ready deploy bytecode...");

  // Ensure contract is compiled
  await hre.run("compile");

  const artifactPath = path.join(
    process.cwd(),
    "artifacts/src/contracts/PiggyBank.sol/PiggyBank.json"
  );
  const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));

  // Use the raw bytecode from artifact (this is the creation bytecode)
  let deployBytecode = artifact.bytecode;

  if (!deployBytecode || deployBytecode === "0x") {
    throw new Error("❌ No bytecode found in artifact");
  }

  // Remove metadata hash if present (Solidity appends metadata at the end)
  // Metadata typically starts with 0xa264... (CBOR-encoded)
  // For Hedera compatibility, we may need to strip this
  const metadataPattern = /a264697066735822[0-9a-f]{68}$/i;
  const hasMetadata = metadataPattern.test(deployBytecode);
  
  if (hasMetadata) {
    console.log("⚠️  Metadata hash detected in bytecode");
    // Keep the bytecode as-is for now, but log it
  }

  const outDir = path.join(process.cwd(), "artifacts-hedera");
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);

  const outFile = path.join(outDir, "PiggyBank.deploy.json");

  const output = {
    contractName: "PiggyBank",
    abi: artifact.abi,
    deployBytecode: deployBytecode, // ✅ Raw creation bytecode from artifact
    bytecodeLengthBytes: (deployBytecode.length - 2) / 2, // Subtract "0x" prefix
    timestamp: new Date().toISOString(),
  };

  fs.writeFileSync(outFile, JSON.stringify(output, null, 2));

  console.log(`✅ Hedera-ready deploy bytecode written to:`);
  console.log(`   ${outFile}`);
  console.log(`📊 Bytecode size: ${output.bytecodeLengthBytes} bytes`);
}

main().catch((err) => {
  console.error("❌ Error generating Hedera bytecode:", err);
  process.exit(1);
});