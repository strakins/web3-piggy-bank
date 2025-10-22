import React from 'react'
import { WalletConnection } from '../types'

interface HeaderProps {
  walletConnection: WalletConnection
  onConnect: () => void
  onDisconnect: () => void
  isConnecting: boolean
}

const Header: React.FC<HeaderProps> = ({ 
  walletConnection, 
  onConnect, 
  onDisconnect, 
  isConnecting 
}) => {
  return (
    <header className="header">
      <div className="container">
        <div className="nav">
          <h1 className="logo">🐷 PiggyBank</h1>
          <div className="nav-actions">
            {walletConnection.isConnected ? (
              <div className="wallet-info">
                <span>{walletConnection.accountId}</span>
                <button 
                  onClick={onDisconnect}
                  className="btn btn-secondary"
                >
                  Disconnect
                </button>
              </div>
            ) : (
              <button 
                onClick={onConnect}
                disabled={isConnecting}
                className="btn btn-primary"
              >
                {isConnecting ? 'Connecting...' : 'Connect HashPack'}
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header