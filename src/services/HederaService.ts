import {
    Client,
    AccountId,
    PrivateKey,
    ContractCreateFlow,
    ContractExecuteTransaction,
    ContractCallQuery,
    ContractFunctionParameters,
    Hbar,
    TransactionResponse,
    ContractId,
    FileCreateTransaction,
    FileAppendTransaction,
    ContractCreateTransaction,
} from '@hashgraph/sdk';
import * as fs from 'fs';
import * as path from 'path';
import { TransactionResult, PiggyBankAccount, StakeInfo } from '../types';

export class HederaService {
    private client: Client;
    private operatorAccountId: AccountId;
    private operatorPrivateKey: PrivateKey;
    private contractId: ContractId | null = null;

    constructor(
        accountId: string,
        privateKey: string,
        network: 'testnet' | 'mainnet' = 'testnet'
    ) {
        this.operatorAccountId = AccountId.fromString(accountId);
        this.operatorPrivateKey = PrivateKey.fromString(privateKey);
        
        if (network === 'testnet') {
            this.client = Client.forTestnet();
        } else {
            this.client = Client.forMainnet();
        }
        
        this.client.setOperator(this.operatorAccountId, this.operatorPrivateKey);
    }

    public setContractId(contractId: string) {
        this.contractId = ContractId.fromString(contractId);
    }

    public async deployContract(contractBytecode: string): Promise<TransactionResult> {
        try {
            // Create a file to store the contract bytecode
            const fileCreateTx = new FileCreateTransaction()
                .setContents(contractBytecode)
                .setKeys([this.operatorPrivateKey.publicKey]);

            const fileCreateResponse = await fileCreateTx.execute(this.client);
            const fileCreateReceipt = await fileCreateResponse.getReceipt(this.client);
            const bytecodeFileId = fileCreateReceipt.fileId;

            if (!bytecodeFileId) {
                throw new Error('Failed to create bytecode file');
            }

            // Create the contract
            const contractCreateTx = new ContractCreateTransaction()
                .setBytecodeFileId(bytecodeFileId)
                .setGas(100000)
                .setConstructorParameters(new ContractFunctionParameters());

            const contractCreateResponse = await contractCreateTx.execute(this.client);
            const contractCreateReceipt = await contractCreateResponse.getReceipt(this.client);
            const newContractId = contractCreateReceipt.contractId;

            if (!newContractId) {
                throw new Error('Failed to create contract');
            }

            this.contractId = newContractId;

            return {
                success: true,
                transactionId: contractCreateResponse.transactionId.toString(),
                receipt: contractCreateReceipt
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    }

    public async deposit(amount: number): Promise<TransactionResult> {
        if (!this.contractId) {
            return { success: false, error: 'Contract not deployed' };
        }

        try {
            const transaction = new ContractExecuteTransaction()
                .setContractId(this.contractId)
                .setGas(100000)
                .setFunction('deposit')
                .setPayableAmount(Hbar.fromTinybars(amount));

            const response = await transaction.execute(this.client);
            const receipt = await response.getReceipt(this.client);

            return {
                success: true,
                transactionId: response.transactionId.toString(),
                receipt
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    }

    public async stake(amount: number, withdrawalDate: Date): Promise<TransactionResult> {
        if (!this.contractId) {
            return { success: false, error: 'Contract not deployed' };
        }

        try {
            const withdrawalTimestamp = Math.floor(withdrawalDate.getTime() / 1000);
            
            const transaction = new ContractExecuteTransaction()
                .setContractId(this.contractId)
                .setGas(100000)
                .setFunction(
                    'stake',
                    new ContractFunctionParameters()
                        .addUint256(amount)
                        .addUint256(withdrawalTimestamp)
                );

            const response = await transaction.execute(this.client);
            const receipt = await response.getReceipt(this.client);

            return {
                success: true,
                transactionId: response.transactionId.toString(),
                receipt
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    }

    public async withdraw(amount: number): Promise<TransactionResult> {
        if (!this.contractId) {
            return { success: false, error: 'Contract not deployed' };
        }

        try {
            const transaction = new ContractExecuteTransaction()
                .setContractId(this.contractId)
                .setGas(100000)
                .setFunction(
                    'withdraw',
                    new ContractFunctionParameters().addUint256(amount)
                );

            const response = await transaction.execute(this.client);
            const receipt = await response.getReceipt(this.client);

            return {
                success: true,
                transactionId: response.transactionId.toString(),
                receipt
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    }

    public async withdrawStaked(stakeIndex: number): Promise<TransactionResult> {
        if (!this.contractId) {
            return { success: false, error: 'Contract not deployed' };
        }

        try {
            const transaction = new ContractExecuteTransaction()
                .setContractId(this.contractId)
                .setGas(100000)
                .setFunction(
                    'withdrawStaked',
                    new ContractFunctionParameters().addUint256(stakeIndex)
                );

            const response = await transaction.execute(this.client);
            const receipt = await response.getReceipt(this.client);

            return {
                success: true,
                transactionId: response.transactionId.toString(),
                receipt
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    }

    public async emergencyWithdraw(): Promise<TransactionResult> {
        if (!this.contractId) {
            return { success: false, error: 'Contract not deployed' };
        }

        try {
            const transaction = new ContractExecuteTransaction()
                .setContractId(this.contractId)
                .setGas(100000)
                .setFunction('emergencyWithdraw');

            const response = await transaction.execute(this.client);
            const receipt = await response.getReceipt(this.client);

            return {
                success: true,
                transactionId: response.transactionId.toString(),
                receipt
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    }

    public async getAccount(accountId: string): Promise<PiggyBankAccount | null> {
        if (!this.contractId) {
            return null;
        }

        try {
            const query = new ContractCallQuery()
                .setContractId(this.contractId)
                .setGas(100000)
                .setFunction(
                    'getAccount',
                    new ContractFunctionParameters().addAddress(accountId)
                );

            const result = await query.execute(this.client);
            
            // Parse the result based on the Account struct
            const balance = result.getUint256(0);
            const stakedBalance = result.getUint256(1);
            const withdrawalDate = result.getUint256(2);
            const lastDepositDate = result.getUint256(3);
            const totalDeposits = result.getUint256(4);
            const totalWithdrawals = result.getUint256(5);
            const penaltiesPaid = result.getUint256(6);
            const exists = result.getBool(7);

            if (!exists) {
                return null;
            }

            return {
                accountId,
                balance: balance.toNumber(),
                stakedBalance: stakedBalance.toNumber(),
                withdrawalDate: withdrawalDate.toNumber() > 0 ? new Date(withdrawalDate.toNumber() * 1000) : null,
                lastDepositDate: new Date(lastDepositDate.toNumber() * 1000),
                totalDeposits: totalDeposits.toNumber(),
                totalWithdrawals: totalWithdrawals.toNumber(),
                penaltiesPaid: penaltiesPaid.toNumber()
            };
        } catch (error) {
            console.error('Error getting account:', error);
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

            const result = await query.execute(this.client);
            
            // Parse the stakes array result
            const stakesCount = result.getUint256(0).toNumber();
            const stakes: StakeInfo[] = [];

            for (let i = 0; i < stakesCount; i++) {
                const baseIndex = 1 + (i * 4); // Each stake has 4 fields
                stakes.push({
                    amount: result.getUint256(baseIndex).toNumber(),
                    withdrawalDate: new Date(result.getUint256(baseIndex + 1).toNumber() * 1000),
                    stakingDate: new Date(result.getUint256(baseIndex + 2).toNumber() * 1000),
                    isActive: result.getBool(baseIndex + 3)
                });
            }

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
            return 0;
        }
    }

    public async getContractBalance(): Promise<number> {
        if (!this.contractId) {
            return 0;
        }

        try {
            const query = new ContractCallQuery()
                .setContractId(this.contractId)
                .setGas(100000)
                .setFunction('getContractBalance');

            const result = await query.execute(this.client);
            return result.getUint256(0).toNumber();
        } catch (error) {
            console.error('Error getting contract balance:', error);
            return 0;
        }
    }
}