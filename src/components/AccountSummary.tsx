import React from 'react'
import { PiggyBankAccount } from '../types'

interface AccountSummaryProps {
  account: PiggyBankAccount | null
}

const AccountSummary: React.FC<AccountSummaryProps> = ({ account }) => {
  const formatHbar = (tinybars: number) => {
    return (tinybars / 100000000).toFixed(8) + ' HBAR'
  }

  const totalBalance = account ? account.balance + account.stakedBalance : 0

  return (
    <div className="account-summary">
      <div className="summary-card">
        <h3>Total Balance</h3>
        <p className="balance">{formatHbar(totalBalance)}</p>
      </div>
      <div className="summary-card">
        <h3>Available Balance</h3>
        <p className="balance">{account ? formatHbar(account.balance) : '0 HBAR'}</p>
      </div>
      <div className="summary-card">
        <h3>Staked Amount</h3>
        <p className="balance">{account ? formatHbar(account.stakedBalance) : '0 HBAR'}</p>
      </div>
    </div>
  )
}

export default AccountSummary