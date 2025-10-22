import { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import { ClientProviders, useDAppConnector } from './components/ClientProviders'
import { WalletButton } from './components/WalletButton'
import Dashboard from './components/Dashboard'
import { ModernHederaService } from './services/ModernHederaService'
import { PiggyBankAccount } from './types'

function AppContent() {
  const { dAppConnector, userAccountId } = useDAppConnector() ?? {}
  const [account, setAccount] = useState<PiggyBankAccount | null>(null)
  const [hederaService, setHederaService] = useState<ModernHederaService | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    initializeHedera()
  }, [dAppConnector])

  useEffect(() => {
    if (userAccountId && hederaService) {
      loadAccountData()
    }
  }, [userAccountId, hederaService])

  const initializeHedera = () => {
    if (dAppConnector) {
      const hedera = new ModernHederaService('testnet')
      hedera.setDAppConnector(dAppConnector)
      
      const contractId = import.meta.env.VITE_CONTRACT_ID
      if (contractId) {
        hedera.setContractId(contractId)
      }
      
      setHederaService(hedera)
    }
  }

  const connectWallet = async () => {
    if (!hashConnectService) {
      toast.error('Services not initialized')
      return
    }

    try {
      setIsInitializing(true)
      
      // Get pairing string for QR code
      const pairing = hashConnectService.getPairingString()
      if (pairing) {
        setPairingString(pairing)
      }

      const connection = await hashConnectService.connectWallet()
      
      if (connection.isConnected) {
        setWalletConnection(connection)
        
        // Initialize Hedera service with wallet connection
        // Note: In production, you'd get these from your backend or environment
        const operatorAccountId = import.meta.env.VITE_HEDERA_ACCOUNT_ID || '0.0.123456'
        const operatorPrivateKey = import.meta.env.VITE_HEDERA_PRIVATE_KEY || 'your-private-key'
        
        const hedera = new HederaService(
          operatorAccountId,
          operatorPrivateKey,
          connection.network === 'mainnet' ? 'mainnet' : 'testnet'
        )

        // Set contract ID if available
        const contractId = import.meta.env.VITE_CONTRACT_ID
        if (contractId) {
          hedera.setContractId(contractId)
        }

        setHederaService(hedera)
        
        // Load account data
        await loadAccountData(hedera, connection.accountId)
        
        setAppState('dashboard')
        toast.success('Wallet connected successfully!')
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error)
      toast.error('Failed to connect wallet. Please try again.')
    } finally {
      setIsInitializing(false)
    }
  }

  const disconnectWallet = () => {
    if (hashConnectService) {
      hashConnectService.disconnect()
    }
    
    setWalletConnection({
      accountId: '',
      isConnected: false,
      network: 'testnet'
    })
    setAccount(null)
    setHederaService(null)
    setPairingString('')
    setAppState('connect')
    toast.success('Wallet disconnected')
  }

  const loadAccountData = async (hedera: HederaService, accountId: string) => {
    try {
      const accountData = await hedera.getAccount(accountId)
      setAccount(accountData)
    } catch (error) {
      console.error('Failed to load account data:', error)
      // Don't show error for new accounts that don't exist yet
    }
  }

  const refreshAccountData = async () => {
    if (hederaService && walletConnection.accountId) {
      await loadAccountData(hederaService, walletConnection.accountId)
    }
  }

  const handleRetry = () => {
    setErrorMessage('')
    setAppState('loading')
    initializeServices()
  }

  if (appState === 'loading') {
    return <LoadingState />
  }

  return (
    <div className="app">
      <Header 
        walletConnection={walletConnection}
        onConnect={connectWallet}
        onDisconnect={disconnectWallet}
        isConnecting={isInitializing}
      />
      
      <main className="main">
        <div className="container">
          {appState === 'connect' && (
            <ConnectState 
              onConnect={connectWallet}
              pairingString={pairingString}
              isConnecting={isInitializing}
            />
          )}
          
          {appState === 'dashboard' && hederaService && (
            <Dashboard
              account={account}
              walletConnection={walletConnection}
              hederaService={hederaService}
              hashConnectService={hashConnectService}
              onRefreshAccount={refreshAccountData}
            />
          )}
          
          {appState === 'error' && (
            <ErrorState 
              message={errorMessage}
              onRetry={handleRetry}
            />
          )}
        </div>
      </main>
    </div>
  )
}

export default App