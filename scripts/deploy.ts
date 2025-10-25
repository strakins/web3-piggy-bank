// scripts/deploy-hedera.ts
import {
    Client,
    AccountId,
    PrivateKey,
    FileCreateTransaction,
    FileAppendTransaction,
    ContractCreateTransaction,
    Hbar,
  } from "@hashgraph/sdk";
  import fs from "fs";
  import path from "path";
  import dotenv from "dotenv";
//   import { fileURLToPath } from "url";
  
  dotenv.config();
  
//   const __filename = fileURLToPath(import.meta.url);
//   const __dirname = path.dirname(__filename);
  
  async function updateEnv(pairs: Record<string, string>) {
    const envPath = path.join(process.cwd(), ".env");
    let content = fs.existsSync(envPath) ? fs.readFileSync(envPath, "utf8") : "";
  
    for (const [k, v] of Object.entries(pairs)) {
      const re = new RegExp(`^${k}=.*$`, "m");
      if (re.test(content)) content = content.replace(re, `${k}=${v}`);
      else content += `${content.endsWith("\n") ? "" : "\n"}${k}=${v}\n`;
    }
    fs.writeFileSync(envPath, content);
  }
  
  async function main() {
    console.log("🚀 Deploying Hedera-ready EVM bytecode…");
  
    const network = (process.env.HEDERA_NETWORK || "testnet").toLowerCase();
    const accountIdStr = process.env.HEDERA_ACCOUNT_ID;
    const privateKeyStr = process.env.HEDERA_PRIVATE_KEY;
  
    if (!accountIdStr || !privateKeyStr) {
      throw new Error("Missing HEDERA_ACCOUNT_ID / HEDERA_PRIVATE_KEY in .env");
    }
  
    const accountId = AccountId.fromString(accountIdStr);
    const privateKey = PrivateKey.fromStringED25519(privateKeyStr); // ✅ auto-detect ED25519 or ECDSA
  
    const client =
      network === "mainnet" ? Client.forMainnet() : Client.forTestnet();
    client.setOperator(accountId, privateKey);
  
    console.log(`📡 Connected to Hedera ${network}`);
  
    // ✅ Load the fully encoded deploy bytecode
    const deployFile = path.join(
      process.cwd(),
      "artifacts-hedera/PiggyBank.deploy.json"
    );
    if (!fs.existsSync(deployFile))
      throw new Error("❌ Missing Hedera deploy bytecode. Run: npm run generate:hedera");
  
    const { deployBytecode } = JSON.parse(fs.readFileSync(deployFile, "utf8"));
    const deployBytes = Buffer.from(
      deployBytecode.startsWith("0x") ? deployBytecode.slice(2) : deployBytecode,
      "hex"
    );
  
    // 📤 Upload bytecode to Hedera File Service
    console.log("📁 Uploading bytecode to Hedera File Service…");
    const CHUNK = 4000;
    const firstChunk = deployBytes.subarray(0, CHUNK);
  
    const fileCreateTx = await new FileCreateTransaction()
      .setKeys([privateKey.publicKey]) // allow us to append further chunks
      .setContents(firstChunk)
      .setMaxTransactionFee(new Hbar(2))
      .freezeWith(client);
  
    const fileCreateSigned = await fileCreateTx.sign(privateKey);
    const fileCreateSubmit = await fileCreateSigned.execute(client);
    const fileReceipt = await fileCreateSubmit.getReceipt(client);
    const fileId = fileReceipt.fileId;
  
    if (!fileId) throw new Error("❌ No fileId returned");
    console.log(`📂 File created: ${fileId.toString()}`);
  
    for (let i = CHUNK; i < deployBytes.length; i += CHUNK) {
      const appendTx = await new FileAppendTransaction()
        .setFileId(fileId)
        .setContents(deployBytes.subarray(i, i + CHUNK))
        .setMaxTransactionFee(new Hbar(2))
        .freezeWith(client);
  
      const appendSigned = await appendTx.sign(privateKey);
      await appendSigned.execute(client);
    }
  
    console.log(`✅ Bytecode uploaded in ${Math.ceil(deployBytes.length / CHUNK)} chunks`);
  
    // 🧱 Create Contract (constructor already encoded inside deployBytecode)
    console.log("📜 Creating contract from bytecode…");
  
    const contractCreateTx = await new ContractCreateTransaction()
      .setBytecodeFileId(fileId)
      .setGas(3_000_000)
      .setMaxTransactionFee(new Hbar(20))
      .freezeWith(client);
  
    const contractCreateSigned = await contractCreateTx.sign(privateKey);
    const contractCreateSubmit = await contractCreateSigned.execute(client);
    const receipt = await contractCreateSubmit.getReceipt(client);
    const contractId = receipt.contractId;
  
    if (!contractId) throw new Error("❌ No contractId in receipt");
  
    console.log(`🎉 Contract deployed!`);
    console.log(`📍 Contract ID: ${contractId.toString()}`);
    console.log(`🗂 Bytecode File ID: ${fileId.toString()}`);
    console.log(`🔗 Tx: ${contractCreateSubmit.transactionId.toString()}`);
    console.log(`👤 Owner: ${accountId.toString()}`);
  
    await updateEnv({
      CONTRACT_ID: contractId.toString(),
      BYTECODE_FILE_ID: fileId.toString(),
    });
  
    console.log("\n✅ Saved to .env");
  }
  
  main().catch((err) => {
    console.error("\n💥 Deployment Failed");
    console.error(err?.message || err);
    process.exit(1);
  });
  