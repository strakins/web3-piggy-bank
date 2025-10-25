// scripts/deploy-fs.ts
import {
    Client,
    AccountId,
    PrivateKey,
    FileCreateTransaction,
    FileAppendTransaction,
    ContractCreateTransaction,
    ContractFunctionParameters,
    Hbar,
  } from "@hashgraph/sdk";
  import fs from "fs";
  import path from "path";
  import dotenv from "dotenv";
  import { fileURLToPath } from "url";
  
  dotenv.config();
  
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  
  async function getInitBytecode(): Promise<Uint8Array> {
    // IMPORTANT: use the init bytecode (artifact.bytecode), not deployedBytecode
    const artifactPath = path.join(
      process.cwd(),
      "artifacts/src/contracts/PiggyBank.sol/PiggyBank.json"
    );
    if (!fs.existsSync(artifactPath)) {
      throw new Error("❌ Artifact not found. Run: npx hardhat compile");
    }
    const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));
  
    const bytecode: string = artifact?.bytecode;
    if (!bytecode || bytecode === "0x") {
      throw new Error("❌ Init bytecode empty. Compile failed?");
    }
    const initHex = bytecode.startsWith("0x") ? bytecode.slice(2) : bytecode;
    return Buffer.from(initHex, "hex"); // do NOT strip metadata
  }
  
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
    console.log("🐷 Starting PiggyBank deployment (FileCreate + ContractCreate)…");
  
    const network = (process.env.HEDERA_NETWORK || "testnet").toLowerCase();
    const accountIdStr = process.env.HEDERA_ACCOUNT_ID;
    const privateKeyStr = process.env.HEDERA_PRIVATE_KEY;
  
    if (!accountIdStr || !privateKeyStr) {
      throw new Error("Missing HEDERA_ACCOUNT_ID / HEDERA_PRIVATE_KEY in .env");
    }
  
    const accountId = AccountId.fromString(accountIdStr);
    const privateKey = PrivateKey.fromString(privateKeyStr);
    const client = network === "mainnet" ? Client.forMainnet() : Client.forTestnet();
    client.setOperator(accountId, privateKey);
  
    console.log(`📡 Connected to Hedera ${network}`);
  
    // 1) Load init bytecode (full, untouched)
    console.log("📄 Reading init bytecode from Hardhat artifacts…");
    const initBytes = await getInitBytecode();
  
    // 2) Create file with first chunk, then append remaining chunks
    console.log("📤 Uploading bytecode to Hedera File Service (chunked) …");
    const CHUNK = 4000;
    const firstChunk = initBytes.slice(0, CHUNK);
  
    const fileCreate = await new FileCreateTransaction()
      .setKeys([privateKey.publicKey]) // allow us (operator) to append
      .setContents(firstChunk)
      .setMaxTransactionFee(new Hbar(2))
      .execute(client);
  
    const fileReceipt = await fileCreate.getReceipt(client);
    const fileId = fileReceipt.fileId;
    if (!fileId) throw new Error("❌ No fileId returned from FileCreateTransaction");
    console.log(`📁 Bytecode file created: ${fileId.toString()}`);
  
    for (let i = CHUNK; i < initBytes.length; i += CHUNK) {
      const chunk = initBytes.slice(i, i + CHUNK);
      await new FileAppendTransaction()
        .setFileId(fileId)
        .setContents(chunk)
        .setMaxTransactionFee(new Hbar(2))
        .execute(client);
    }
    console.log("✅ Bytecode uploaded (all chunks)");
  
    // 3) Deploy contract via ContractCreateTransaction
    // Constructor has no params, but we still pass an empty ContractFunctionParameters for clarity.
    console.log("🚀 Deploying contract via ContractCreateTransaction …");
    const createTx = await new ContractCreateTransaction()
      .setBytecodeFileId(fileId)
      .setConstructorParameters(new ContractFunctionParameters()) // empty constructor
      .setGas(3_000_000)
      .setMaxTransactionFee(new Hbar(20))
      .execute(client);
  
    const createRcpt = await createTx.getReceipt(client);
    const contractId = createRcpt.contractId;
    if (!contractId) throw new Error("❌ No contractId returned in receipt");
  
    console.log("🎉 Contract deployed!");
    console.log(`📧 Contract ID: ${contractId.toString()}`);
    console.log(`🔗 Tx ID: ${createTx.transactionId.toString()}`);
    console.log(`📄 Bytecode File ID (kept): ${fileId.toString()}`);
  
    // 4) Persist to .env (you asked to keep file on-chain)
    await updateEnv({
      CONTRACT_ID: contractId.toString(),
      BYTECODE_FILE_ID: fileId.toString(),
    });
  
    console.log("\n✨ Deployment Summary");
    console.log(`   Network: ${network}`);
    console.log(`   Contract ID: ${contractId.toString()}`);
    console.log(`   Bytecode File ID: ${fileId.toString()}`);
    console.log(`   Transaction ID: ${createTx.transactionId.toString()}`);
  }
  
  main().catch((e) => {
    console.error("\n💥 Deployment failed!");
    console.error(e?.message || e);
    process.exit(1);
  });
  