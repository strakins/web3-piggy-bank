import {
    Client,
    AccountId,
    PrivateKey,
    FileContentsQuery,
  } from "@hashgraph/sdk";
  import fs from "fs";
  import path from "path";
  import dotenv from "dotenv";
  import { fileURLToPath } from "url";
  
  dotenv.config();
  
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  
  async function main() {
    const network = (process.env.HEDERA_NETWORK || "testnet").toLowerCase();
    const accountIdStr = process.env.HEDERA_ACCOUNT_ID;
    const privateKeyStr = process.env.HEDERA_PRIVATE_KEY;
    const bytecodeFileId = process.env.BYTECODE_FILE_ID;
  
    if (!accountIdStr || !privateKeyStr || !bytecodeFileId) {
      throw new Error("Missing env vars: HEDERA_ACCOUNT_ID, HEDERA_PRIVATE_KEY, BYTECODE_FILE_ID");
    }
  
    const client =
      network === "mainnet" ? Client.forMainnet() : Client.forTestnet();
    client.setOperator(AccountId.fromString(accountIdStr), PrivateKey.fromString(privateKeyStr));
  
    console.log(`🔍 Fetching file contents for: ${bytecodeFileId}`);
  
    const fileContents = await new FileContentsQuery()
      .setFileId(bytecodeFileId)
      .execute(client);
  
    const storedHex = Buffer.from(fileContents).toString("hex");
  
    console.log(`📦 Retrieved file size: ${fileContents.length} bytes`);
  
    const deployFile = path.join(process.cwd(), "artifacts-hedera/PiggyBank.deploy.json");
    if (!fs.existsSync(deployFile)) {
      throw new Error("❌ Cannot find PiggyBank.deploy.json. Run: npm run generate:hedera");
    }
  
    const { deployBytecode } = JSON.parse(fs.readFileSync(deployFile, "utf8"));
    const localHex = deployBytecode.startsWith("0x")
      ? deployBytecode.slice(2)
      : deployBytecode;
  
    console.log(`🧪 Comparing local vs stored bytecode...`);
  
    if (storedHex === localHex) {
      console.log("✅ MATCH: Stored bytecode matches local deploy bytecode exactly.");
    } else {
      console.log("❌ MISMATCH DETECTED!");
      console.log(`Local length : ${localHex.length / 2} bytes`);
      console.log(`Stored length: ${storedHex.length / 2} bytes`);
  
      // Show difference preview
      const diffIndex = [...storedHex].findIndex((c, i) => storedHex[i] !== localHex[i]);
      console.log(`First difference at hex index: ${diffIndex}`);
    }
  }
  
  main().catch(err => {
    console.error("💥 Check Failed");
    console.error(err.message || err);
    process.exit(1);
  });
  