export interface PiggyBankAccount {
  accountId: string;
  balance: number;
  stakedBalance: number;
  withdrawalDate: Date | null;
  lastDepositDate: Date;
  totalDeposits: number;
  totalWithdrawals: number;
  penaltiesPaid: number;
}

export interface StakeInfo {
  amount: number;
  withdrawalDate: Date;
  stakingDate: Date;
  isActive: boolean;
}

export interface TransactionResult {
  success: boolean;
  transactionId?: string;
  error?: string;
  receipt?: any;
}

export interface WalletConnection {
  accountId: string;
  isConnected: boolean;
  network: string;
}

export interface HashConnectData {
  topic: string;
  pairingString: string;
  encryptionKey: string;
}

export enum TransactionType {
  DEPOSIT = 'DEPOSIT',
  STAKE = 'STAKE',
  WITHDRAW = 'WITHDRAW',
  PENALTY = 'PENALTY'
}

export interface PiggyBankTransaction {
  id: string;
  type: TransactionType;
  amount: number;
  timestamp: Date;
  accountId: string;
  transactionId: string;
  penalty?: number;
}