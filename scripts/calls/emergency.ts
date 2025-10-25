import { ContractExecuteTransaction } from "@hashgraph/sdk";
import { getClient, requireContractId, pretty } from "../lib/hedera.js";

async function main() {
  const client = getClient();
  const contractId = requireContractId();

  const tx = await new ContractExecuteTransaction()
    .setContractId(contractId)
    .setGas(1_000_000)
    .setFunction("emergencyWithdraw")
    .execute(client);

  const receipt = await tx.getReceipt(client);
  pretty("EmergencyWithdraw Receipt", {
    status: receipt.status.toString(),
    txId: tx.transactionId.toString(),
    contractId
  });
}

main().catch((e) => {
  console.error(e?.message || e);
  process.exit(1);
});
