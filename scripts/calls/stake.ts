import { ContractExecuteTransaction, ContractFunctionParameters } from "@hashgraph/sdk";
import { getClient, requireContractId, pretty } from "../lib/hedera.js";

async function main() {
  const client = getClient();
  const contractId = requireContractId();

  // Usage: npm run call:stake -- <amountWei> <withdrawalUnixSeconds>
  const amountWei = process.argv[2];
  const when = Number(process.argv[3] || 0);
  if (!amountWei || !when) {
    throw new Error("Usage: npm run call:stake -- <amountWei> <withdrawalUnixSeconds>");
  }

  const params = new ContractFunctionParameters()
    .addUint256(amountWei)     // amount in wei (same unit as msg.value)
    .addUint256(when);         // UNIX seconds in the future

  const tx = await new ContractExecuteTransaction()
    .setContractId(contractId)
    .setGas(500_000)
    .setFunction("stake", params)
    .execute(client);

  const receipt = await tx.getReceipt(client);

  pretty("Stake Receipt", {
    status: receipt.status.toString(),
    txId: tx.transactionId.toString(),
    contractId,
    amountWei,
    withdrawalDate: when
  });
}

main().catch((e) => {
  console.error(e?.message || e);
  process.exit(1);
});
