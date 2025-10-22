import { HashConnect } from 'hashconnect';
import { WalletConnection, HashConnectData } from '../types';

export class HashConnectService {
    private hashconnect: HashConnect;
    private appMetadata: any;
    private pairingData: HashConnectData | null = null;
    private isInitialized = false;
    private connectedAccountId: string | null = null;

    constructor(
        appName: string = 'Hedera PiggyBank',
        appDescription: string = 'A decentralized piggybank with staking functionality',
        appIcon: string = '',
        appUrl: string = 'http://localhost:3000'
    ) {
        this.hashconnect = new HashConnect(true); // true for debug mode
        
        this.appMetadata = {
            name: appName,
            description: appDescription,
            icon: appIcon,
            url: appUrl
        };

        this.setupEventHandlers();
    }

    private setupEventHandlers() {
        // Handle pairing events
        this.hashconnect.pairingEvent.on((pairingData: any) => {
            console.log('Pairing event received:', pairingData);
            this.pairingData = {
                topic: pairingData.topic,
                pairingString: pairingData.pairingString,
                encryptionKey: pairingData.encryptionKey
            };
        });

        // Handle connection events
        this.hashconnect.connectionStatusChangeEvent.on((connectionData: any) => {
            console.log('Connection status changed:', connectionData);
            if (connectionData.status === 'Connected') {
                this.connectedAccountId = connectionData.accountIds[0];
            } else {
                this.connectedAccountId = null;
            }
        });

        // Handle transaction events
        this.hashconnect.transactionEvent.on((transactionData: any) => {
            console.log('Transaction event received:', transactionData);
        });
    }

    public async initialize(): Promise<void> {
        if (this.isInitialized) {
            return;
        }

        try {
            // Initialize HashConnect
            const initData = await this.hashconnect.init(this.appMetadata);
            console.log('HashConnect initialized:', initData);
            this.isInitialized = true;
        } catch (error) {
            console.error('Failed to initialize HashConnect:', error);
            throw error;
        }
    }

    public async connectWallet(): Promise<WalletConnection> {
        if (!this.isInitialized) {
            await this.initialize();
        }

        try {
            // Create pairing
            const pairingData = await this.hashconnect.createPairing();
            console.log('Pairing created:', pairingData);

            // Wait for user to pair their wallet
            return new Promise((resolve, reject) => {
                const timeout = setTimeout(() => {
                    reject(new Error('Wallet connection timeout'));
                }, 60000); // 60 second timeout

                this.hashconnect.connectionStatusChangeEvent.once((connectionData: any) => {
                    clearTimeout(timeout);
                    
                    if (connectionData.status === 'Connected' && connectionData.accountIds.length > 0) {
                        this.connectedAccountId = connectionData.accountIds[0];
                        resolve({
                            accountId: this.connectedAccountId!,
                            isConnected: true,
                            network: connectionData.network
                        });
                    } else {
                        reject(new Error('Failed to connect wallet'));
                    }
                });
            });
        } catch (error) {
            console.error('Failed to connect wallet:', error);
            throw error;
        }
    }

    public getPairingString(): string | null {
        return this.pairingData?.pairingString || null;
    }

    public async sendTransaction(transaction: any): Promise<any> {
        if (!this.isInitialized) {
            throw new Error('HashConnect not initialized');
        }

        if (!this.connectedAccountId) {
            throw new Error('No wallet connected');
        }

        try {
            const result = await this.hashconnect.sendTransaction(
                this.pairingData!.topic,
                transaction
            );
            return result;
        } catch (error) {
            console.error('Failed to send transaction:', error);
            throw error;
        }
    }

    public async signMessage(message: string): Promise<any> {
        if (!this.isInitialized) {
            throw new Error('HashConnect not initialized');
        }

        if (!this.connectedAccountId) {
            throw new Error('No wallet connected');
        }

        try {
            const result = await this.hashconnect.signMessage(
                this.pairingData!.topic,
                message,
                this.connectedAccountId
            );
            return result;
        } catch (error) {
            console.error('Failed to sign message:', error);
            throw error;
        }
    }

    public disconnect(): void {
        if (this.pairingData) {
            this.hashconnect.disconnect(this.pairingData.topic);
            this.pairingData = null;
            this.connectedAccountId = null;
        }
    }

    public getConnectedAccount(): string | null {
        return this.connectedAccountId;
    }

    public isConnected(): boolean {
        return this.connectedAccountId !== null;
    }

    public getConnectionStatus(): WalletConnection {
        return {
            accountId: this.connectedAccountId || '',
            isConnected: this.isConnected(),
            network: 'testnet' // You might want to get this dynamically
        };
    }

    // Helper method to create transaction objects for Hedera transactions
    public createHederaTransaction(
        contractId: string,
        functionName: string,
        parameters?: any,
        hbarAmount?: number
    ): any {
        const transaction: any = {
            contractId,
            functionName,
            gas: 100000,
            amount: hbarAmount || 0
        };

        if (parameters) {
            transaction.functionParameters = parameters;
        }

        return transaction;
    }

    // Convenience methods for PiggyBank operations
    public async depositToPiggyBank(contractId: string, amount: number): Promise<any> {
        const transaction = this.createHederaTransaction(
            contractId,
            'deposit',
            null,
            amount
        );
        
        return this.sendTransaction(transaction);
    }

    public async stakeInPiggyBank(
        contractId: string,
        amount: number,
        withdrawalDate: Date
    ): Promise<any> {
        const withdrawalTimestamp = Math.floor(withdrawalDate.getTime() / 1000);
        
        const transaction = this.createHederaTransaction(
            contractId,
            'stake',
            {
                amount,
                withdrawalDate: withdrawalTimestamp
            }
        );
        
        return this.sendTransaction(transaction);
    }

    public async withdrawFromPiggyBank(contractId: string, amount: number): Promise<any> {
        const transaction = this.createHederaTransaction(
            contractId,
            'withdraw',
            { amount }
        );
        
        return this.sendTransaction(transaction);
    }

    public async withdrawStakedFromPiggyBank(contractId: string, stakeIndex: number): Promise<any> {
        const transaction = this.createHederaTransaction(
            contractId,
            'withdrawStaked',
            { stakeIndex }
        );
        
        return this.sendTransaction(transaction);
    }

    public async emergencyWithdrawFromPiggyBank(contractId: string): Promise<any> {
        const transaction = this.createHederaTransaction(
            contractId,
            'emergencyWithdraw'
        );
        
        return this.sendTransaction(transaction);
    }
}