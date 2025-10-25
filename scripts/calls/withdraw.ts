import { ContractExecuteTransaction, ContractFunctionParameters } from "@hashgraph/sdk";
import { getClient, requireContractId, pretty } from "../lib/hedera.js";

async function main() {
  const client = getClient();
  const contractId = requireContractId();

  // Usage: npm run call:withdraw -- <amountWei>
  const amountWei = process.argv[2];
  if (!amountWei) {
    throw new Error("Usage: npm run call:withdraw -- <amountWei>");
  }

  const params = new ContractFunctionParameters().addUint256(amountWei);

  const tx = await new ContractExecuteTransaction()
    .setContractId(contractId)
    .setGas(300_000)
    .setFunction("withdraw", params)
    .execute(client);

  const receipt = await tx.getReceipt(client);

  pretty("Withdraw Receipt", {
    status: receipt.status.toString(),
    txId: tx.transactionId.toString(),
    contractId,
    amountWei
  });
}

main().catch((e) => {
  console.error(e?.message || e);
  process.exit(1);
});
