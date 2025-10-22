import React, { useState } from 'react'
import { PiggyBankAccount } from '../types'

interface ActionCardsProps {
  account: PiggyBankAccount | null
  onDeposit: (amount: number) => Promise<void>
  onStake: (amount: number, withdrawalDate: Date) => Promise<void>
  onWithdraw: (amount: number) => Promise<void>
  onEmergencyWithdraw: () => Promise<void>
  isLoading: boolean
}

const ActionCards: React.FC<ActionCardsProps> = ({
  account,
  onDeposit,
  onStake,
  onWithdraw,
  onEmergencyWithdraw,
  isLoading
}) => {
  const [depositAmount, setDepositAmount] = useState('')
  const [stakeAmount, setStakeAmount] = useState('')
  const [withdrawAmount, setWithdrawAmount] = useState('')
  const [withdrawalDate, setWithdrawalDate] = useState('')

  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault()
    const amount = parseFloat(depositAmount)
    if (!amount || amount <= 0) {
      alert('Please enter a valid deposit amount')
      return
    }
    
    await onDeposit(amount)
    setDepositAmount('')
  }

  const handleStake = async (e: React.FormEvent) => {
    e.preventDefault()
    const amount = parseFloat(stakeAmount)
    if (!amount || amount <= 0) {
      alert('Please enter a valid stake amount')
      return
    }
    
    if (!withdrawalDate) {
      alert('Please select a withdrawal date')
      return
    }

    const date = new Date(withdrawalDate)
    if (date <= new Date()) {
      alert('Withdrawal date must be in the future')
      return
    }

    const availableBalance = account ? account.balance / 100000000 : 0
    if (amount > availableBalance) {
      alert('Insufficient available balance')
      return
    }

    await onStake(amount, date)
    setStakeAmount('')
    setWithdrawalDate('')
  }

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault()
    const amount = parseFloat(withdrawAmount)
    if (!amount || amount <= 0) {
      alert('Please enter a valid withdrawal amount')
      return
    }

    const availableBalance = account ? account.balance / 100000000 : 0
    if (amount > availableBalance) {
      alert('Insufficient available balance')
      return
    }

    await onWithdraw(amount)
    setWithdrawAmount('')
  }

  // Get minimum datetime for stake withdrawal (1 hour from now)
  const getMinDateTime = () => {
    const now = new Date()
    now.setHours(now.getHours() + 1)
    return now.toISOString().slice(0, 16)
  }

  return (
    <div className="actions-section">
      <div className="action-card">
        <h3>Deposit HBAR</h3>
        <form onSubmit={handleDeposit}>
          <div className="form-group">
            <label htmlFor="depositAmount">Amount (HBAR)</label>
            <input
              type="number"
              id="depositAmount"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              placeholder="Enter amount"
              min="0"
              step="0.00000001"
              disabled={isLoading}
            />
          </div>
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={isLoading || !depositAmount}
          >
            {isLoading ? 'Processing...' : 'Deposit'}
          </button>
        </form>
      </div>

      <div className="action-card">
        <h3>Stake HBAR</h3>
        <form onSubmit={handleStake}>
          <div className="form-group">
            <label htmlFor="stakeAmount">Amount (HBAR)</label>
            <input
              type="number"
              id="stakeAmount"
              value={stakeAmount}
              onChange={(e) => setStakeAmount(e.target.value)}
              placeholder="Enter amount"
              min="0"
              step="0.00000001"
              max={account ? (account.balance / 100000000).toString() : '0'}
              disabled={isLoading}
            />
          </div>
          <div className="form-group">
            <label htmlFor="withdrawalDate">Withdrawal Date</label>
            <input
              type="datetime-local"
              id="withdrawalDate"
              value={withdrawalDate}
              onChange={(e) => setWithdrawalDate(e.target.value)}
              min={getMinDateTime()}
              disabled={isLoading}
            />
          </div>
          <button 
            type="submit" 
            className="btn btn-success"
            disabled={isLoading || !stakeAmount || !withdrawalDate || !account || account.balance === 0}
          >
            {isLoading ? 'Processing...' : 'Stake'}
          </button>
        </form>
      </div>

      <div className="action-card">
        <h3>Withdraw HBAR</h3>
        <form onSubmit={handleWithdraw}>
          <div className="form-group">
            <label htmlFor="withdrawAmount">Amount (HBAR)</label>
            <input
              type="number"
              id="withdrawAmount"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              placeholder="Enter amount"
              min="0"
              step="0.00000001"
              max={account ? (account.balance / 100000000).toString() : '0'}
              disabled={isLoading}
            />
          </div>
          <button 
            type="submit" 
            className="btn btn-warning"
            disabled={isLoading || !withdrawAmount || !account || account.balance === 0}
          >
            {isLoading ? 'Processing...' : 'Withdraw'}
          </button>
          <button 
            type="button"
            onClick={onEmergencyWithdraw}
            className="btn btn-danger"
            disabled={isLoading || !account || (account.balance === 0 && account.stakedBalance === 0)}
            style={{ marginTop: '0.5rem' }}
          >
            {isLoading ? 'Processing...' : 'Emergency Withdraw All'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default ActionCards