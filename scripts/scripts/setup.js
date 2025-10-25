#!/usr/bin/env node

/**
 * Simple development deployment script for PiggyBank
 * 
 * This script helps you get started quickly by:
 * 1. Setting up environment variables
 * 2. Providing contract compilation instructions
 * 3. Guiding through the deployment process
 */

console.log('🐷 PiggyBank Development Setup\n')

console.log('📋 Setup Checklist:')
console.log('□ 1. Set up Hedera testnet account')
console.log('□ 2. Configure environment variables')
console.log('□ 3. Compile Solidity contract')
console.log('□ 4. Deploy contract to Hedera')
console.log('□ 5. Update frontend configuration')
console.log('□ 6. Test with HashPack wallet\n')

console.log('🔧 Step 1: Environment Setup')
console.log('Create a .env file with the following variables:')
console.log(`
# Hedera Network Configuration
HEDERA_NETWORK=testnet
HEDERA_ACCOUNT_ID=0.0.YOUR_ACCOUNT_ID
HEDERA_PRIVATE_KEY=YOUR_PRIVATE_KEY

# Contract Configuration (will be set after deployment)
CONTRACT_ID=

# HashConnect Configuration
HASHCONNECT_APP_NAME=Hedera PiggyBank
HASHCONNECT_APP_DESCRIPTION=A decentralized piggybank with staking functionality
HASHCONNECT_APP_ICON=
HASHCONNECT_APP_URL=http://localhost:3000

# Vite Frontend Environment Variables
VITE_HEDERA_NETWORK=testnet
VITE_HEDERA_ACCOUNT_ID=0.0.YOUR_ACCOUNT_ID
VITE_HEDERA_PRIVATE_KEY=YOUR_PRIVATE_KEY
VITE_CONTRACT_ID=
VITE_HASHCONNECT_APP_NAME=Hedera PiggyBank
VITE_HASHCONNECT_APP_DESCRIPTION=A decentralized piggybank with staking functionality
VITE_HASHCONNECT_APP_ICON=
VITE_HASHCONNECT_APP_URL=http://localhost:3000
`)

console.log('🏗️  Step 2: Contract Compilation')
console.log('To compile the PiggyBank.sol contract:')
console.log('1. Option A - Use Remix IDE (Recommended for beginners):')
console.log('   - Go to https://remix.ethereum.org/')
console.log('   - Copy the contents of src/contracts/PiggyBank.sol')
console.log('   - Compile and get the bytecode')
console.log('')
console.log('2. Option B - Use Hardhat (Advanced):')
console.log('   - npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox')
console.log('   - npx hardhat init')
console.log('   - Add PiggyBank.sol to contracts/')
console.log('   - npx hardhat compile')
console.log('')

console.log('🚀 Step 3: Deployment')
console.log('After compiling the contract:')
console.log('1. Update the bytecode in scripts/deploy.ts')
console.log('2. Run: npm run deploy')
console.log('3. The script will output your CONTRACT_ID')
console.log('4. Update your .env file with the CONTRACT_ID')
console.log('')

console.log('🎯 Step 4: Testing')
console.log('1. Start the development server: npm run dev')
console.log('2. Install HashPack wallet extension')
console.log('3. Create/import a Hedera testnet account')
console.log('4. Connect wallet and test the PiggyBank functionality')
console.log('')

console.log('📚 Resources:')
console.log('- Hedera Documentation: https://docs.hedera.com/')
console.log('- HashPack Wallet: https://www.hashpack.app/')
console.log('- Hedera Testnet Faucet: https://portal.hedera.com/')
console.log('- Remix IDE: https://remix.ethereum.org/')
console.log('')

console.log('💡 Need help?')
console.log('Check the README.md file for detailed instructions or')
console.log('visit the Hedera Discord community for support.')
console.log('')

console.log('Happy coding! 🚀')