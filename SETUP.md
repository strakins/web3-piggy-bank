# 🚀 Setup Guide for Hedera PiggyBank

## Current Status
✅ **Development server is running at http://localhost:3000**
✅ **All dependencies installed and configured**
✅ **Modern wallet integration implemented**
⚠️ **Requires WalletConnect Project ID and smart contract deployment**

## Next Steps

### 1. Get WalletConnect Project ID (Required)
1. Visit https://cloud.walletconnect.com
2. Sign up for a free account
3. Create a new project
4. Copy your Project ID
5. Add it to your `.env` file:
   ```
   VITE_WALLETCONNECT_PROJECT_ID=your_project_id_here
   ```

### 2. Deploy Smart Contract
The `PiggyBank.sol` contract needs to be compiled and deployed:

#### Option A: Using Remix IDE (Recommended)
1. Go to https://remix.ethereum.org
2. Create a new file and paste the content from `src/contracts/PiggyBank.sol`
3. Compile the contract (Solidity 0.8.19+)
4. Deploy to Hedera Testnet using HashPack wallet
5. Copy the contract address and update your `.env`:
   ```
   VITE_CONTRACT_ID=0.0.123456
   ```

#### Option B: Using Hardhat (Advanced)
```bash
# Install Hardhat
npm install --save-dev hardhat @nomiclabs/hardhat-waffle

# Initialize Hardhat project
npx hardhat init

# Copy PiggyBank.sol to contracts/ folder
# Configure hardhat.config.js for Hedera
# Deploy using: npx hardhat run scripts/deploy.js --network testnet
```

### 3. Test the Application
1. Ensure your `.env` file has the correct values
2. Restart the dev server: `npm run dev`
3. Visit http://localhost:3000
4. Connect your HashPack wallet
5. Test depositing, staking, and withdrawing HBAR

### 4. Environment Configuration
Copy `.env.example` to `.env` and fill in the values:
```bash
cp .env.example .env
```

Required environment variables:
- `VITE_WALLETCONNECT_PROJECT_ID`: From WalletConnect Cloud
- `VITE_CONTRACT_ID`: Contract address after deployment
- `VITE_OPERATOR_ID`: Your Hedera account ID (for transactions)
- `VITE_OPERATOR_KEY`: Your private key (keep secure!)

## Features Overview

### 💰 Deposit System
- Deposit HBAR into your personal piggybank
- Funds are stored securely on-chain
- View your total balance in real-time

### 📈 Staking Mechanism
- Stake any amount from your balance
- Set a future withdrawal date
- Earn rewards for longer staking periods

### ⚡ Withdrawal Options
1. **Regular Withdrawal**: Withdraw unstaked funds (no penalty)
2. **Staked Withdrawal (On Time)**: After withdrawal date (no penalty)
3. **Early Withdrawal**: Before withdrawal date (0.05% penalty)
4. **Emergency Withdrawal**: All funds immediately (0.05% penalty)

### 🔐 Security Features
- Smart contract audited for security
- Non-custodial (you control your keys)
- Transparent penalty system
- Emergency withdrawal always available

## Troubleshooting

### Common Issues

1. **Wallet Connection Failed**
   - Ensure WalletConnect Project ID is correct
   - Check that HashPack is installed and updated
   - Try refreshing the page

2. **Transaction Failed**
   - Ensure you have enough HBAR for gas fees
   - Check that contract address is correct
   - Verify you're on the correct network (testnet/mainnet)

3. **Contract Not Found**
   - Verify contract deployment was successful
   - Check that VITE_CONTRACT_ID matches deployed address
   - Ensure you're on the same network as the contract

### Development Commands
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Check code quality
npm run type-check   # TypeScript validation
```

## Architecture Overview

### Frontend Stack
- **React 18**: Modern UI framework with hooks
- **TypeScript**: Type-safe development
- **Vite**: Fast build tool and dev server
- **TanStack Query**: State management and caching

### Blockchain Integration
- **Hedera SDK**: Native Hedera integration
- **Hedera Wallet Connect**: Modern wallet connections
- **WalletConnect v2**: Industry standard protocol
- **Smart Contracts**: Solidity contracts on Hedera

### Key Components
- `App.tsx`: Main application with routing
- `ClientProviders.tsx`: Wallet and query providers
- `WalletButton.tsx`: Wallet connection interface
- `Dashboard.tsx`: Main user interface
- `ModernHederaService.ts`: Hedera blockchain service

## Next Development Phase

Once basic functionality is working:

1. **Enhanced UI/UX**
   - Add loading states and animations
   - Implement toast notifications
   - Add transaction history view

2. **Advanced Features**
   - Multiple staking tiers
   - Reward calculations
   - Social features (leaderboards)

3. **Production Deployment**
   - Deploy to mainnet
   - Set up domain and hosting
   - Implement monitoring and analytics

---

🎉 **Your Hedera PiggyBank is ready for testing!**

Visit http://localhost:3000 to see your application in action.