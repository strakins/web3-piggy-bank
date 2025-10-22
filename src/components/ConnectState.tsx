import React, { useEffect, useRef } from 'react'
import QRCode from 'qrcode'

interface ConnectStateProps {
  onConnect: () => void
  pairingString: string
  isConnecting: boolean
}

const ConnectState: React.FC<ConnectStateProps> = ({ onConnect, pairingString, isConnecting }) => {
  const qrCodeRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (pairingString && qrCodeRef.current) {
      QRCode.toCanvas(pairingString, { width: 256 }, (error, canvas) => {
        if (error) {
          console.error('Failed to generate QR code:', error)
          return
        }
        
        // Clear previous QR code
        qrCodeRef.current!.innerHTML = ''
        qrCodeRef.current!.appendChild(canvas)
      })
    }
  }, [pairingString])

  return (
    <div className="connect-state">
      <div className="welcome-card">
        <h2>Welcome to PiggyBank</h2>
        <p>A decentralized savings platform with staking rewards on Hedera</p>
        
        <div className="features">
          <div className="feature">
            <span className="feature-icon">💰</span>
            <h3>Secure Deposits</h3>
            <p>Deposit HBAR safely into your personal piggybank</p>
          </div>
          <div className="feature">
            <span className="feature-icon">📈</span>
            <h3>Stake & Earn</h3>
            <p>Stake your deposits with custom withdrawal dates</p>
          </div>
          <div className="feature">
            <span className="feature-icon">⚡</span>
            <h3>Early Withdrawal</h3>
            <p>Access funds early with just a 0.05% penalty fee</p>
          </div>
        </div>

        <button 
          onClick={onConnect}
          disabled={isConnecting}
          className="btn btn-primary"
          style={{ fontSize: '1.1rem', padding: '1rem 2rem' }}
        >
          {isConnecting ? 'Connecting...' : 'Connect HashPack Wallet'}
        </button>

        {pairingString && (
          <div className="pairing-info">
            <h3>Scan QR Code with HashPack</h3>
            <div ref={qrCodeRef} className="qr-code"></div>
            <p className="pairing-string">{pairingString}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ConnectState