# 🐷 Hedera PiggyBank

A decentralized piggybank application built on Hedera Hashgraph with staking functionality and modern wallet integration.

## ✨ Features

- **💰 Secure Deposits**: Deposit HBAR safely into your personal piggybank
- **📈 Stake & Earn**: Stake your deposits with custom withdrawal dates
- **⚡ Early Withdrawal**: Access funds early with just a 0.05% penalty fee
- **🔐 Modern Wallet Integration**: Seamless connection using Hedera Wallet Connect
- **⚡ Fast Transactions**: Built on Hedera's high-performance network
- **🎨 Modern UI**: Beautiful React TypeScript interface
- **📱 Multi-Wallet Support**: Works with HashPack, Blade, and other Hedera wallets

## 🏗️ Architecture

- **Frontend**: React + TypeScript + Vite
- **Smart Contract**: Solidity contract deployed on Hedera
- **Wallet**: Modern Hedera Wallet Connect integration
- **Network**: Hedera Testnet/Mainnet

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- HashPack wallet (or other Hedera-compatible wallet)
- Hedera testnet account with HBAR
- WalletConnect Project ID (free from https://cloud.walletconnect.com)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd pigBank
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   VITE_HEDERA_NETWORK=testnet
   VITE_CONTRACT_ID=0.0.xxxxx
   VITE_OPERATOR_ID=0.0.xxxxx
   VITE_OPERATOR_KEY=your_private_key_here
   VITE_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
   ```

4. **Deploy Smart Contract**
   Compile `src/contracts/PiggyBank.sol` using Remix IDE or Hardhat:
   ```bash
   # Using the included deployment script (requires smart contract compilation first)
   npm run deploy
   ```

5. **Start the application**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:3000` and connect your wallet!

## 📱 Usage

### Connecting Wallet

1. Click "Connect HashPack" button
2. Scan QR code with HashPack mobile app or connect with browser extension
3. Approve the connection

### Making Deposits

1. Enter the amount in HBAR
2. Click "Deposit" button
3. Confirm transaction in HashPack

### Staking Funds

1. Enter the amount to stake
2. Select withdrawal date (must be in the future)
3. Click "Stake" button
4. Confirm transaction in HashPack

### Withdrawing Funds

#### Regular Withdrawal
- Available for unstaked balance
- No penalties applied

#### Staked Withdrawal
- **On Time**: No penalty after withdrawal date
- **Early**: 0.05% penalty fee applied

#### Emergency Withdrawal
- Withdraws all funds (staked + unstaked)
- 0.05% penalty on total amount

## 🔧 Development

### Project Structure

```
src/
├── components/         # React components
│   ├── ClientProviders.tsx    # Modern wallet connection provider
│   ├── WalletButton.tsx      # Wallet connection UI
│   ├── Dashboard.tsx         # Main dashboard interface
│   ├── StakeForm.tsx        # Staking functionality
│   └── TransactionList.tsx   # Transaction history
├── services/          # Business logic
│   ├── ModernHederaService.ts # Modern Hedera integration
│   └── ContractService.ts     # Smart contract interactions
├── types/            # TypeScript types
│   └── index.ts
├── contracts/        # Smart contracts
│   └── PiggyBank.sol # Main contract implementation
```

### Modern Wallet Integration

This application uses the latest Hedera Wallet Connect infrastructure:

- **@hashgraph/hedera-wallet-connect**: Modern wallet connection library
- **WalletConnect v2**: Industry standard for wallet connections
- **Multi-wallet Support**: Works with HashPack, Blade, and other Hedera wallets
- **Event-driven Architecture**: Real-time wallet state updates
- **React Query Integration**: Efficient state management and caching

Key Components:
- `ClientProviders.tsx`: Sets up DAppConnector and React Query
- `WalletButton.tsx`: Simple wallet connection interface
- `ModernHederaService.ts`: Modern Hedera SDK integration

### Available Scripts
│   └── PiggyBank.sol
└── App.tsx           # Main app component

scripts/
├── deploy.ts         # Deployment script
└── setup.js          # Development setup guide
```

### Available Scripts

```bash
# Development
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build

# Deployment
npm run deploy       # Deploy smart contract
npm run setup        # Show setup instructions

# Code Quality
npm run lint         # Lint code
npm run type-check   # TypeScript type checking
```

### Smart Contract Functions

The PiggyBank contract provides:

- `deposit()` - Deposit HBAR to piggybank
- `stake(amount, withdrawalDate)` - Stake funds with withdrawal date
- `withdraw(amount)` - Withdraw unstaked funds
- `withdrawStaked(stakeIndex)` - Withdraw specific stake
- `emergencyWithdraw()` - Withdraw all funds (with penalty)
- `getAccount(address)` - Get account information
- `getActiveStakes(address)` - Get active stakes
- `calculatePenalty(amount)` - Calculate penalty amount

## 🔒 Security Considerations

- Private keys should never be exposed in frontend code
- Use environment variables for sensitive configuration
- Consider using a backend service for production deployments
- Always verify contract addresses before transactions
- Test thoroughly on testnet before mainnet deployment

## 🛠️ Troubleshooting

### Common Issues

1. **"Cannot find module" errors**
   - Run `npm install` to install dependencies
   - Check Node.js version (18+ required)

2. **HashConnect connection fails**
   - Ensure HashPack wallet is installed
   - Check network configuration (testnet/mainnet)
   - Verify app metadata in environment variables

3. **Transaction failures**
   - Check account has sufficient HBAR balance
   - Verify contract is deployed and address is correct
   - Ensure wallet is connected to correct network

4. **Contract deployment issues**
   - Compile Solidity contract first
   - Check Hedera account has sufficient balance
   - Verify network configuration

### Getting Help

- Check the [Hedera Documentation](https://docs.hedera.com/)
- Join the [Hedera Discord](https://hedera.com/discord)
- Visit [HashPack Support](https://www.hashpack.app/support)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Hedera Hashgraph team for the excellent SDK
- HashPack team for wallet integration
- React and TypeScript communities
- All contributors and testers

---

Built with ❤️ on Hedera Hashgraph