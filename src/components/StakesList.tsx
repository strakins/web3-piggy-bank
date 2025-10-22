import React from 'react'
import { StakeInfo } from '../types'

interface StakesListProps {
  stakes: StakeInfo[]
  onWithdrawStake: (stakeIndex: number) => Promise<void>
  isLoading: boolean
}

const StakesList: React.FC<StakesListProps> = ({ stakes, onWithdrawStake, isLoading }) => {
  const formatHbar = (tinybars: number) => {
    return (tinybars / 100000000).toFixed(8) + ' HBAR'
  }

  const formatDate = (date: Date) => {
    return date.toLocaleString()
  }

  const isWithdrawalAvailable = (withdrawalDate: Date) => {
    return new Date() >= withdrawalDate
  }

  const getTimeRemaining = (withdrawalDate: Date) => {
    const now = new Date()
    const diff = withdrawalDate.getTime() - now.getTime()
    
    if (diff <= 0) return 'Available now'
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    
    if (days > 0) return `${days}d ${hours}h remaining`
    if (hours > 0) return `${hours}h ${minutes}m remaining`
    return `${minutes}m remaining`
  }

  if (stakes.length === 0) {
    return (
      <div className="stakes-section">
        <h3>Your Active Stakes</h3>
        <div className="stakes-container">
          <p className="no-stakes">No active stakes found</p>
        </div>
      </div>
    )
  }

  return (
    <div className="stakes-section">
      <h3>Your Active Stakes</h3>
      <div className="stakes-container">
        {stakes.map((stake, index) => {
          const canWithdraw = isWithdrawalAvailable(stake.withdrawalDate)
          const timeRemaining = getTimeRemaining(stake.withdrawalDate)
          
          return (
            <div key={index} className="stake-item">
              <div className="stake-info">
                <div>
                  <strong>Amount:</strong> {formatHbar(stake.amount)}
                </div>
                <div>
                  <strong>Staked:</strong> {formatDate(stake.stakingDate)}
                </div>
                <div>
                  <strong>Withdrawal Date:</strong> {formatDate(stake.withdrawalDate)}
                </div>
                <div>
                  <strong>Status:</strong> 
                  <span style={{ 
                    color: canWithdraw ? '#10b981' : '#f59e0b',
                    fontWeight: 'bold',
                    marginLeft: '0.5rem'
                  }}>
                    {timeRemaining}
                  </span>
                </div>
              </div>
              <div className="stake-actions">
                <button
                  onClick={() => onWithdrawStake(index)}
                  disabled={isLoading}
                  className={`btn ${canWithdraw ? 'btn-success' : 'btn-warning'}`}
                  style={{ minWidth: '120px' }}
                >
                  {isLoading ? 'Processing...' : canWithdraw ? 'Withdraw' : 'Early Withdraw'}
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default StakesList