import { ContractExecuteTransaction, ContractFunctionParameters } from "@hashgraph/sdk";
import { getClient, requireContractId, pretty } from "../lib/hedera.js";

async function main() {
  const client = getClient();
  const contractId = requireContractId();

  // Usage: npm run call:withdrawStaked -- <stakeIndex>
  const stakeIndex = Number(process.argv[2] || -1);
  if (stakeIndex < 0) {
    throw new Error("Usage: npm run call:withdrawStaked -- <stakeIndex>");
  }

  const params = new ContractFunctionParameters().addUint256(stakeIndex);

  const tx = await new ContractExecuteTransaction()
    .setContractId(contractId)
    .setGas(700_000)
    .setFunction("withdrawStaked", params)
    .execute(client);

  const receipt = await tx.getReceipt(client);

  pretty("WithdrawStaked Receipt", {
    status: receipt.status.toString(),
    txId: tx.transactionId.toString(),
    contractId,
    stakeIndex
  });
}

main().catch((e) => {
  console.error(e?.message || e);
  process.exit(1);
});
