import { 
    Client, 
    AccountId, 
    PrivateKey, 
    FileCreateTransaction, 
    FileAppendTransaction, 
    ContractCreateTransaction, 
    ContractFunctionParameters,
    Hbar
} from '@hashgraph/sdk'
import * as fs from 'fs'
import * as path from 'path'
import * as dotenv from 'dotenv'

// Load environment variables
dotenv.config()

async function deployPiggyBankContract() {
    console.log('🐷 Starting PiggyBank Contract Deployment...')

    // Validate required environment variables
    const requiredEnvVars = [
        'HEDERA_ACCOUNT_ID',
        'HEDERA_PRIVATE_KEY'
    ]

    for (const envVar of requiredEnvVars) {
        if (!process.env[envVar]) {
            throw new Error(`Missing required environment variable: ${envVar}`)
        }
    }

    // Set up Hedera client
    const accountId = AccountId.fromString(process.env.HEDERA_ACCOUNT_ID!)
    const privateKey = PrivateKey.fromString(process.env.HEDERA_PRIVATE_KEY!)
    
    let client: Client
    const network = process.env.HEDERA_NETWORK || 'testnet'
    
    if (network === 'mainnet') {
        client = Client.forMainnet()
        console.log('📡 Connected to Hedera Mainnet')
    } else {
        client = Client.forTestnet()
        console.log('📡 Connected to Hedera Testnet')
    }
    
    client.setOperator(accountId, privateKey)

    try {
        // Step 1: Compile contract (you'll need to compile the Solidity contract first)
        console.log('📄 Reading contract bytecode...')
        
        // For this example, we'll create a simple bytecode
        // In a real deployment, you'd compile the Solidity contract using a tool like Hardhat or Truffle
        const contractBytecode = await getContractBytecode()

        // Step 2: Create file to store bytecode
        console.log('📤 Uploading contract bytecode to Hedera File Service...')
        
        const fileCreateTx = new FileCreateTransaction()
            .setContents(contractBytecode)
            .setKeys([privateKey])
            .setMaxTransactionFee(new Hbar(2))

        const fileCreateResponse = await fileCreateTx.execute(client)
        const fileCreateReceipt = await fileCreateResponse.getReceipt(client)
        const bytecodeFileId = fileCreateReceipt.fileId

        console.log(`✅ Contract bytecode uploaded. File ID: ${bytecodeFileId}`)

        // Step 3: Deploy the contract
        console.log('🚀 Deploying PiggyBank contract...')
        
        const contractCreateTx = new ContractCreateTransaction()
            .setBytecodeFileId(bytecodeFileId!)
            .setGas(2000000)
            .setConstructorParameters(new ContractFunctionParameters())
            .setMaxTransactionFee(new Hbar(20))

        const contractCreateResponse = await contractCreateTx.execute(client)
        const contractCreateReceipt = await contractCreateResponse.getReceipt(client)
        const contractId = contractCreateReceipt.contractId

        console.log(`🎉 PiggyBank contract deployed successfully!`)
        console.log(`📧 Contract ID: ${contractId}`)
        console.log(`🔗 Transaction ID: ${contractCreateResponse.transactionId}`)

        // Step 4: Update .env file with contract ID
        await updateEnvFile(contractId!.toString())

        console.log('📝 Environment file updated with contract ID')
        console.log('\n🎯 Next steps:')
        console.log('1. Update your frontend environment variables')
        console.log('2. Start the development server: npm run dev')
        console.log('3. Connect your HashPack wallet')
        console.log('4. Start using your PiggyBank! 🐷💰')

        return {
            contractId: contractId!.toString(),
            fileId: bytecodeFileId!.toString(),
            transactionId: contractCreateResponse.transactionId.toString(),
            network
        }

    } catch (error) {
        console.error('❌ Deployment failed:', error)
        throw error
    }
}

async function getContractBytecode(): Promise<string> {
    // In a real implementation, you would:
    // 1. Compile the Solidity contract using solc or hardhat
    // 2. Extract the bytecode from the compilation artifacts
    
    // For this example, we'll return a placeholder
    // You need to compile the PiggyBank.sol contract first
    
    const contractPath = path.join(__dirname, '../src/contracts/PiggyBank.sol')
    
    if (!fs.existsSync(contractPath)) {
        throw new Error('PiggyBank.sol contract file not found. Please ensure it exists.')
    }
    
    console.log('⚠️  Note: Contract compilation not implemented in this script.')
    console.log('   Please compile your Solidity contract using:')
    console.log('   - Hardhat: npx hardhat compile')
    console.log('   - Truffle: truffle compile')
    console.log('   - Remix: Copy contract to Remix IDE')
    console.log('   Then update this script with the actual bytecode.')
    
    throw new Error('Contract compilation required. Please compile PiggyBank.sol first.')
}

async function updateEnvFile(contractId: string): Promise<void> {
    const envPath = path.join(process.cwd(), '.env')
    let envContent = ''
    
    try {
        if (fs.existsSync(envPath)) {
            envContent = fs.readFileSync(envPath, 'utf-8')
        }
    } catch (error) {
        console.log('Creating new .env file...')
    }
    
    // Check if CONTRACT_ID already exists
    if (envContent.includes('CONTRACT_ID=')) {
        // Replace existing CONTRACT_ID
        envContent = envContent.replace(/CONTRACT_ID=.*$/m, `CONTRACT_ID=${contractId}`)
    } else {
        // Add new CONTRACT_ID
        envContent += `\nCONTRACT_ID=${contractId}\n`
    }
    
    fs.writeFileSync(envPath, envContent)
}

// Main execution
if (require.main === module) {
    deployPiggyBankContract()
        .then((result) => {
            console.log('\n✨ Deployment Summary:')
            console.log(`   Contract ID: ${result.contractId}`)
            console.log(`   File ID: ${result.fileId}`)
            console.log(`   Transaction ID: ${result.transactionId}`)
            console.log(`   Network: ${result.network}`)
            process.exit(0)
        })
        .catch((error) => {
            console.error('\n💥 Deployment failed!')
            console.error(error.message)
            process.exit(1)
        })
}

export { deployPiggyBankContract }