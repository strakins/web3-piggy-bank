/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_HEDERA_NETWORK: string
  readonly VITE_HEDERA_ACCOUNT_ID: string
  readonly VITE_HEDERA_PRIVATE_KEY: string
  readonly VITE_CONTRACT_ID: string
  readonly VITE_HASHCONNECT_APP_NAME: string
  readonly VITE_HASHCONNECT_APP_DESCRIPTION: string
  readonly VITE_HASHCONNECT_APP_ICON: string
  readonly VITE_HASHCONNECT_APP_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}