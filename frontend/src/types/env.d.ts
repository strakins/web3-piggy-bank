/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_HEDERA_RPC_URL: string
  readonly VITE_HEDERA_CHAIN_ID: string
  readonly VITE_HEDERA_EXPLORER_URL: string
  readonly VITE_APP_NAME: string
  readonly VITE_APP_DESCRIPTION: string
  readonly VITE_PIGGY_VAULT_ADDRESS: string
  readonly VITE_YIELD_MANAGER_ADDRESS: string
  readonly VITE_NFT_REWARDS_ADDRESS: string
  readonly VITE_MOCK_USDT_ADDRESS: string
  readonly VITE_FACTORY_ADDRESS: string
  readonly VITE_ENVIRONMENT: string
  readonly VITE_DEBUG_MODE: string
  readonly VITE_ANALYTICS_ID: string
  readonly VITE_SENTRY_DSN: string
  readonly VITE_WALLETCONNECT_PROJECT_ID: string
  readonly VITE_ALCHEMY_API_KEY: string
  readonly VITE_INFURA_API_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare global {
  interface Window {
    ethereum?: any
  }
}

export {}
