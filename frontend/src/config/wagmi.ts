/**
 * Wagmi Configuration for Piggy Boss
 * 
 * Configures Wagmi client with RainbowKit for wallet connections,
 * including Hedera Network configuration and auto-connect functionality.
 */

import { connectorsForWallets } from '@rainbow-me/rainbowkit'
import { 
  injectedWallet,
  metaMaskWallet,
  walletConnectWallet,
  coinbaseWallet,
  rainbowWallet
} from '@rainbow-me/rainbowkit/wallets'
import { configureChains, createConfig } from 'wagmi'
import { defineChain } from 'viem'
import { mainnet, sepolia } from 'wagmi/chains'
import { publicProvider } from 'wagmi/providers/public'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { infuraProvider } from 'wagmi/providers/infura'

// Define Hedera Network
export const hederaTestnet = defineChain({
  id: 296,
  name: 'Hedera Testnet',
  network: 'hedera-testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'HBAR',
    symbol: 'HBAR',
  },
  rpcUrls: {
    default: {
      http: ['https://testnet.hashio.io/api'],
    },
    public: {
      http: ['https://testnet.hashio.io/api'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Hedera Explorer',
      url: 'https://hashscan.io/testnet',
    },
  },
  testnet: true,
})

// Define Hedera Mainnet
export const hederaMainnet = defineChain({
  id: 295,
  name: 'Hedera Mainnet',
  network: 'hedera-mainnet',
  nativeCurrency: {
    decimals: 18,
    name: 'HBAR',
    symbol: 'HBAR',
  },
  rpcUrls: {
    default: {
      http: ['https://mainnet.hashio.io/api'],
    },
    public: {
      http: ['https://mainnet.hashio.io/api'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Hedera Explorer',
      url: 'https://hashscan.io/mainnet',
    },
  },
  testnet: false,
})

// Wallet configuration
const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || 'your-project-id'

// Configure chains and providers
const { chains, publicClient } = configureChains(
  [hederaTestnet, hederaMainnet],
  [
    alchemyProvider({ apiKey: import.meta.env.VITE_ALCHEMY_API_KEY || '' }),
    infuraProvider({ apiKey: import.meta.env.VITE_INFURA_API_KEY || '' }),
    publicProvider()
  ]
)

// Configure wallets
const connectors = connectorsForWallets([
  {
    groupName: 'Recommended',
    wallets: [
      injectedWallet({ chains }),
      metaMaskWallet({ projectId, chains }),
      walletConnectWallet({ projectId, chains }),
      coinbaseWallet({ appName: 'Piggy Boss', chains }),
      rainbowWallet({ projectId, chains }),
    ],
  },
]);

// Create Wagmi config
export const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient
})



export const getPreferredNetwork = () => {
  const isProduction = import.meta.env.PROD
  return isProduction ? hederaMainnet : hederaTestnet
}

export default wagmiConfig
