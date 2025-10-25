import { ContractCallQuery, ContractFunctionParameters, Hbar } from "@hashgraph/sdk";
import { getClient, requireContractId, pretty } from "../lib/hedera.js";

async function callFunction(
  client: ReturnType<typeof getClient>,
  contractId: string,
  fn: string,
  params?: ContractFunctionParameters,
  gas = 150_000
) {
  const q = await new ContractCallQuery()
    .setContractId(contractId)
    .setGas(gas)
    .setFunction(fn, params ?? new ContractFunctionParameters())
    .setQueryPayment(new Hbar(0.5))
    .execute(client);
  return q;
}

async function main() {
  const client = getClient();
  const contractId = requireContractId();

  // Usage:
  // npm run call:getters -- <accountEvmAddress>  (optional)

  const addr = process.argv[2];

  // getContractBalance()
  const balRes = await callFunction(client, contractId, "getContractBalance");
  const balanceWei = balRes.getUint256(0);
  pretty("getContractBalance()", { balanceWei: balanceWei.toString() });

  if (addr) {
    // getAccount(address)
    const accRes = await callFunction(
      client,
      contractId,
      "getAccount",
      new ContractFunctionParameters().addAddress(addr),
      300_000
    );

    // Account tuple layout matches your struct fields
    const account = {
      balance: accRes.getUint256(0).toString(),
      stakedBalance: accRes.getUint256(1).toString(),
      withdrawalDate: accRes.getUint256(2).toString(),
      lastDepositDate: accRes.getUint256(3).toString(),
      totalDeposits: accRes.getUint256(4).toString(),
      totalWithdrawals: accRes.getUint256(5).toString(),
      penaltiesPaid: accRes.getUint256(6).toString(),
      exists: accRes.getBool(7),
    };
    pretty(`getAccount(${addr})`, account);

    // getActiveStakes(address)
    const stakesRes = await callFunction(
      client,
      contractId,
      "getActiveStakes",
      new ContractFunctionParameters().addAddress(addr),
      600_000
    );

    // Decode StakeInfo[] — pull as dynamic tuple array
    const stakes = [];
    const len = stakesRes.getArray(0).length; // SDK stores as array of records
    for (let i = 0; i < len; i++) {
      const rec = stakesRes.getArray(0)[i];
      stakes.push({
        amount: rec.getUint256(0).toString(),
        withdrawalDate: rec.getUint256(1).toString(),
        stakingDate: rec.getUint256(2).toString(),
        isActive: rec.getBool(3),
      });
    }
    pretty(`getActiveStakes(${addr})`, stakes);
  }
}

main().catch((e) => {
  console.error(e?.message || e);
  process.exit(1);
});
