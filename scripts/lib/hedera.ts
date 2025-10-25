// scripts/lib/hedera.ts
import { Client, AccountId, PrivateKey } from "@hashgraph/sdk";
import dotenv from "dotenv";
dotenv.config();

export function getClient(): Client {
  const network = (process.env.HEDERA_NETWORK || "testnet").toLowerCase();
  const accountIdStr = process.env.HEDERA_ACCOUNT_ID;
  const privKeyStr = process.env.HEDERA_PRIVATE_KEY;

  if (!accountIdStr || !privKeyStr) {
    throw new Error("Missing HEDERA_ACCOUNT_ID / HEDERA_PRIVATE_KEY in .env");
  }

  const accountId = AccountId.fromString(accountIdStr);
  const privateKey = PrivateKey.fromStringECDSA(privKeyStr);

  const client =
    network === "mainnet" ? Client.forMainnet() : Client.forTestnet();

  client.setOperator(accountId, privateKey);
  return client;
}

export function requireContractId(): string {
  const id = process.env.CONTRACT_ID;
  if (!id) throw new Error("CONTRACT_ID not set in .env (deploy first)");
  return id;
}

export function pretty(title: string, obj: any) {
  console.log(`\n— ${title} —`);
  console.log(JSON.stringify(obj, null, 2));
}
