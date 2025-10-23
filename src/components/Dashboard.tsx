import React, { useState } from 'react'
import { PiggyBankAccount } from '../types'

interface DashboardProps {
  account: PiggyBankAccount | null 
  userAccountId: string
  isLoading: boolean
  onDeposit: (amount: number) => Promise<void>
  onStake: (amount: number, withdrawalDate: Date) => Promise<void>
  onWithdraw: (amount: number) => Promise<void>
  onRefreshAccount: () => Promise<void>
}

const Dashboard: React.FC<DashboardProps> = ({
  account,
  userAccountId,
  isLoading,
  onDeposit,
  onStake,
  onWithdraw,
  onRefreshAccount
}) => {
  const [depositAmount, setDepositAmount] = useState('')
  const [stakeAmount, setStakeAmount] = useState('')
  const [withdrawAmount, setWithdrawAmount] = useState('')
  const [withdrawalDate, setWithdrawalDate] = useState('')

  const formatHbar = (tinybars: number) => {
    return (tinybars / 100000000).toFixed(8) + ' HBAR'
  }

  const totalBalance = account ? account.balance + account.stakedBalance : 0
  const availableBalance = account ? account.balance : 0
  const stakedBalance = account ? account.stakedBalance : 0

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

    const availableBalanceHbar = availableBalance / 100000000
    if (amount > availableBalanceHbar) {
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

    const availableBalanceHbar = availableBalance / 100000000
    if (amount > availableBalanceHbar) {
      alert('Insufficient available balance')
      return
    }

    await onWithdraw(amount)
    setWithdrawAmount('')
  }

  const getMinDateTime = () => {
    const now = new Date()
    now.setHours(now.getHours() + 1)
    return now.toISOString().slice(0, 16)
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>Your PiggyBank Dashboard</h2>
        <div className="account-summary">
          <div className="summary-card">
            <h3>Total Balance</h3>
            <p className="balance">{formatHbar(totalBalance)}</p>
          </div>
          <div className="summary-card">
            <h3>Available Balance</h3>
            <p className="balance">{formatHbar(availableBalance)}</p>
          </div>
          <div className="summary-card">
            <h3>Staked Amount</h3>
            <p className="balance">{formatHbar(stakedBalance)}</p>
          </div>
        </div>
        <button 
          onClick={onRefreshAccount}
          disabled={isLoading}
          className="btn btn-secondary"
          style={{ marginTop: '1rem' }}
        >
          {isLoading ? 'Loading...' : 'Refresh Account'}
        </button>
      </div>

      <div className="dashboard-content">
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
                  max={availableBalance ? (availableBalance / 100000000).toString() : '0'}
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
                disabled={isLoading || !stakeAmount || !withdrawalDate || availableBalance === 0}
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
                  max={availableBalance ? (availableBalance / 100000000).toString() : '0'}
                  disabled={isLoading}
                />
              </div>
              <button 
                type="submit" 
                className="btn btn-warning"
                disabled={isLoading || !withdrawAmount || availableBalance === 0}
              >
                {isLoading ? 'Processing...' : 'Withdraw'}
              </button>
            </form>
          </div>
        </div>

        <div className="info-section">
          <div className="action-card">
            <h3>Account Information</h3>
            <p><strong>Account ID:</strong> {userAccountId}</p>
            {account && (
              <>
                <p><strong>Total Deposits:</strong> {formatHbar(account.totalDeposits)}</p>
                <p><strong>Total Withdrawals:</strong> {formatHbar(account.totalWithdrawals)}</p>
                <p><strong>Penalties Paid:</strong> {formatHbar(account.penaltiesPaid)}</p>
                <p><strong>Last Deposit:</strong> {account.lastDepositDate.toLocaleString()}</p>
              </>
            )}
            {!account && (
              <p className="no-account">No account data found. Make your first deposit to get started!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard