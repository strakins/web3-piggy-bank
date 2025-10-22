import {
  Client,
  AccountId,
  ContractExecuteTransaction,
  ContractCallQuery,
  ContractFunctionParameters,
  Hbar,
  TransactionId,
} from '@hashgraph/sdk';
import { DAppConnector } from '@hashgraph/hedera-wallet-connect';
import { PiggyBankAccount, StakeInfo } from '../types';

export class ModernHederaService {
  private client: Client;
  private contractId: string | null = null;
  private dAppConnector: DAppConnector | null = null;

  constructor(network: 'testnet' | 'mainnet' = 'testnet') {
    if (network === 'testnet') {
      this.client = Client.forTestnet();
    } else {
      this.client = Client.forMainnet();
    }
  }

  public setDAppConnector(connector: DAppConnector) {
    this.dAppConnector = connector;
  }

  public setContractId(contractId: string) {
    this.contractId = contractId;
  }

  public async deposit(amount: number, accountId: string): Promise<any> {
    if (!this.contractId || !this.dAppConnector) {
      throw new Error('Contract not deployed or wallet not connected');
    }

    try {
      const hedEraAccountId = AccountId.fromString(accountId);
      const signer = this.dAppConnector.getSigner(hedEraAccountId);
      console.log('Starting deposit transaction:', { amount, accountId, contractId: this.contractId });
      
      const transaction = new ContractExecuteTransaction()
        .setContractId(this.contractId)
        .setGas(300000)
        .setFunction('deposit')
        .setPayableAmount(Hbar.fromTinybars(amount))
        .setTransactionId(TransactionId.generate(hedEraAccountId));

      console.log('Transaction built:', { amount: amount.toString(), gas: 300000 });

      console.log('Executing transaction with signer');
      const response = await transaction.executeWithSigner(signer);
      const receipt = await response.getReceiptWithSigner(signer);
      
      console.log('Deposit transaction receipt status:', receipt.status.toString());
      return { response: response.toJSON(), receipt };
    } catch (error) {
      console.error('Deposit transaction error:', error);
      throw new Error(`Deposit failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  public async stake(amount: number, withdrawalDate: Date, accountId: string): Promise<any> {
    if (!this.contractId || !this.dAppConnector) {
      throw new Error('Contract not deployed or wallet not connected');
    }

    try {
      const hedEraAccountId = AccountId.fromString(accountId);
      const signer = this.dAppConnector.getSigner(hedEraAccountId);
      const withdrawalTimestamp = Math.floor(withdrawalDate.getTime() / 1000);
      
      const transaction = new ContractExecuteTransaction()
        .setContractId(this.contractId)
        .setGas(300000)
        .setFunction(
          'stake',
          new ContractFunctionParameters()
            .addUint256(amount)
            .addUint256(withdrawalTimestamp)
        )
        .setTransactionId(TransactionId.generate(hedEraAccountId));

      const response = await transaction.executeWithSigner(signer);
      const receipt = await response.getReceiptWithSigner(signer);
      
      return { response: response.toJSON(), receipt };
    } catch (error) {
      console.error('Stake transaction error:', error);
      throw new Error(`Stake failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  public async withdraw(amount: number, accountId: string): Promise<any> {
    if (!this.contractId || !this.dAppConnector) {
      throw new Error('Contract not deployed or wallet not connected');
    }

    try {
      const hedEraAccountId = AccountId.fromString(accountId);
      const signer = this.dAppConnector.getSigner(hedEraAccountId);
      const transaction = new ContractExecuteTransaction()
        .setContractId(this.contractId)
        .setGas(300000)
        .setFunction(
          'withdraw',
          new ContractFunctionParameters().addUint256(amount)
        )
        .setTransactionId(TransactionId.generate(hedEraAccountId));

      const response = await transaction.executeWithSigner(signer);
      const receipt = await response.getReceiptWithSigner(signer);
      
      return { response: response.toJSON(), receipt };
    } catch (error) {
      console.error('Withdraw transaction error:', error);
      throw new Error(`Withdraw failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  public async withdrawStaked(stakeIndex: number, accountId: string): Promise<any> {
    if (!this.contractId || !this.dAppConnector) {
      throw new Error('Contract not deployed or wallet not connected');
    }

    try {
      const hedEraAccountId = AccountId.fromString(accountId);
      const signer = this.dAppConnector.getSigner(hedEraAccountId);
      const transaction = new ContractExecuteTransaction()
        .setContractId(this.contractId)
        .setGas(300000)
        .setFunction(
          'withdrawStaked',
          new ContractFunctionParameters().addUint256(stakeIndex)
        )
        .setTransactionId(TransactionId.generate(hedEraAccountId));

      const response = await transaction.executeWithSigner(signer);
      const receipt = await response.getReceiptWithSigner(signer);
      
      return { response: response.toJSON(), receipt };
    } catch (error) {
      console.error('WithdrawStaked transaction error:', error);
      throw new Error(`Withdraw staked failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  public async emergencyWithdraw(accountId: string): Promise<any> {
    if (!this.contractId || !this.dAppConnector) {
      throw new Error('Contract not deployed or wallet not connected');
    }

    try {
      const hedEraAccountId = AccountId.fromString(accountId);
      const signer = this.dAppConnector.getSigner(hedEraAccountId);
      const transaction = new ContractExecuteTransaction()
        .setContractId(this.contractId)
        .setGas(300000)
        .setFunction('emergencyWithdraw')
        .setTransactionId(TransactionId.generate(hedEraAccountId));

      const response = await transaction.executeWithSigner(signer);
      const receipt = await response.getReceiptWithSigner(signer);
      
      return { response: response.toJSON(), receipt };
    } catch (error) {
      console.error('Emergency withdraw transaction error:', error);
      throw new Error(`Emergency withdraw failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  // Query functions don't need wallet connection
  public async getAccount(accountId: string): Promise<PiggyBankAccount | null> {
    if (!this.contractId) {
      console.warn('Contract ID not set');
      return null;
    }

    try {
      // Convert Hedera account ID to Solidity address format
      const parsedAccountId = AccountId.fromString(accountId);
      const solidityAddress = parsedAccountId.toSolidityAddress();
      
      console.log('Querying account:', { accountId, solidityAddress, contractId: this.contractId });
      
      const query = new ContractCallQuery()
        .setContractId(this.contractId)
        .setGas(100000)
        .setFunction(
          'getAccount',
          new ContractFunctionParameters().addAddress(solidityAddress)
        );

      const queryResult = await query.execute(this.client);
      
      console.log('Query result received:', queryResult);
      
      // The contract returns an Account struct with these fields in order:
      // uint256 balance
      // uint256 stakedBalance
      // uint256 withdrawalDate
      // uint256 lastDepositDate
      // uint256 totalDeposits
      // uint256 totalWithdrawals
      // uint256 penaltiesPaid
      // bool exists
      
      // For struct returns, we need to get the tuple elements
      const balance = queryResult.getUint256(0);
      const stakedBalance = queryResult.getUint256(1);
      const withdrawalDate = queryResult.getUint256(2);
      const lastDepositDate = queryResult.getUint256(3);
      const totalDeposits = queryResult.getUint256(4);
      const totalWithdrawals = queryResult.getUint256(5);
      const penaltiesPaid = queryResult.getUint256(6);
      const exists = queryResult.getBool(7);

      console.log('Parsed struct values:', { 
        balance: balance.toString(), 
        stakedBalance: stakedBalance.toString(),
        withdrawalDate: withdrawalDate.toString(),
        exists 
      });

      // Check if account exists on the contract
      if (!exists) {
        console.log('Account does not exist on contract - returning null');
        return null;
      }

      const accountData = {
        accountId,
        balance: balance.toNumber(),
        stakedBalance: stakedBalance.toNumber(),
        withdrawalDate: withdrawalDate.toNumber() > 0 ? new Date(withdrawalDate.toNumber() * 1000) : null,
        lastDepositDate: new Date(lastDepositDate.toNumber() * 1000),
        totalDeposits: totalDeposits.toNumber(),
        totalWithdrawals: totalWithdrawals.toNumber(),
        penaltiesPaid: penaltiesPaid.toNumber()
      };

      console.log('Successfully parsed account data:', accountData);
      return accountData;
    } catch (error) {
      console.error('Error getting account from contract:', error);
      if (error instanceof Error) {
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
      }
      return null;
    }
  }

  public async getActiveStakes(accountId: string): Promise<StakeInfo[]> {
    if (!this.contractId) {
      return [];
    }

    try {
      const query = new ContractCallQuery()
        .setContractId(this.contractId)
        .setGas(100000)
        .setFunction(
          'getActiveStakes',
          new ContractFunctionParameters().addAddress(accountId)
        );

      const queryResult = await query.execute(this.client);
      
      // This is a simplified version - you may need to adjust based on your contract's return format
      const stakes: StakeInfo[] = [];
      // Parse the result according to your contract's structure
      
      return stakes;
    } catch (error) {
      console.error('Error getting active stakes:', error);
      return [];
    }
  }

  public async calculatePenalty(amount: number): Promise<number> {
    if (!this.contractId) {
      return 0;
    }

    try {
      const query = new ContractCallQuery()
        .setContractId(this.contractId)
        .setGas(100000)
        .setFunction(
          'calculatePenalty',
          new ContractFunctionParameters().addUint256(amount)
        );

      const result = await query.execute(this.client);
      return result.getUint256(0).toNumber();
    } catch (error) {
      console.error('Error calculating penalty:', error);
      return Math.floor(amount * 0.0005); // Fallback calculation: 0.05%
    }
  }
}
