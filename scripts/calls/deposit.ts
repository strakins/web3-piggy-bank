import {
    ContractExecuteTransaction,
    Hbar,
  } from "@hashgraph/sdk";
  import { getClient, requireContractId, pretty } from "../lib/hedera.js";
  
  async function main() {
    const client = getClient();
    const contractId = requireContractId();
  
    // Usage: npm run call:deposit -- 0.5
    const amountHbar = parseFloat(process.argv[2] || "0");
    if (!amountHbar || amountHbar <= 0) {
      throw new Error("Usage: npm run call:deposit -- <amount-hbar>");
    }
  
    const tx = await new ContractExecuteTransaction()
      .setContractId(contractId)
      .setGas(300_000)
      .setFunction("deposit") // no params
      .setPayableAmount(new Hbar(amountHbar))
      .execute(client);
  
    const receipt = await tx.getReceipt(client);
    pretty("Deposit Receipt", {
      status: receipt.status.toString(),
      txId: tx.transactionId.toString(),
      contractId,
      amountHbar,
    });
  }
  
  main().catch((e) => {
    console.error(e?.message || e);
    process.exit(1);
  });
  