import React, { useState } from 'react'
import { PiggyBankAccount, StakeInfo } from '../types'
import AccountSummary from './AccountSummary'
import ActionCards from './ActionCards'
import StakesList from './StakesList'
import PenaltyModal from './PenaltyModal'

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
  walletConnection,
  hederaService,
  hashConnectService,
  onRefreshAccount
}) => {
  const [stakes, setStakes] = useState<StakeInfo[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [penaltyModal, setPenaltyModal] = useState<{
    isOpen: boolean
    stakeIndex?: number
    amount: number
    penalty: number
  }>({
    isOpen: false,
    amount: 0,
    penalty: 0
  })

  useEffect(() => {
    loadStakes()
  }, [walletConnection.accountId])

  const loadStakes = async () => {
    if (!walletConnection.accountId) return

    try {
      const activeStakes = await hederaService.getActiveStakes(walletConnection.accountId)
      setStakes(activeStakes)
    } catch (error) {
      console.error('Failed to load stakes:', error)
    }
  }

  const handleDeposit = async (amount: number) => {
    if (!hashConnectService) {
      toast.error('Wallet service not available')
      return
    }

    setIsLoading(true)
    try {
      const contractId = import.meta.env.VITE_CONTRACT_ID
      if (!contractId) {
        toast.error('Contract not deployed')
        return
      }

      const hbarAmount = Math.floor(amount * 100000000) // Convert HBAR to tinybars
      await hashConnectService.depositToPiggyBank(contractId, hbarAmount)
      
      toast.success('Deposit transaction submitted!')
      
      // Refresh account data after a delay
      setTimeout(() => {
        onRefreshAccount()
      }, 5000)
      
    } catch (error) {
      console.error('Deposit failed:', error)
      toast.error('Deposit failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleStake = async (amount: number, withdrawalDate: Date) => {
    if (!hashConnectService) {
      toast.error('Wallet service not available')
      return
    }

    setIsLoading(true)
    try {
      const contractId = import.meta.env.VITE_CONTRACT_ID
      if (!contractId) {
        toast.error('Contract not deployed')
        return
      }

      const hbarAmount = Math.floor(amount * 100000000) // Convert HBAR to tinybars
      await hashConnectService.stakeInPiggyBank(contractId, hbarAmount, withdrawalDate)
      
      toast.success('Stake transaction submitted!')
      
      // Refresh account data and stakes after a delay
      setTimeout(() => {
        onRefreshAccount()
        loadStakes()
      }, 5000)
      
    } catch (error) {
      console.error('Stake failed:', error)
      toast.error('Stake failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleWithdraw = async (amount: number) => {
    if (!hashConnectService) {
      toast.error('Wallet service not available')
      return
    }

    setIsLoading(true)
    try {
      const contractId = import.meta.env.VITE_CONTRACT_ID
      if (!contractId) {
        toast.error('Contract not deployed')
        return
      }

      const hbarAmount = Math.floor(amount * 100000000) // Convert HBAR to tinybars
      await hashConnectService.withdrawFromPiggyBank(contractId, hbarAmount)
      
      toast.success('Withdrawal transaction submitted!')
      
      // Refresh account data after a delay
      setTimeout(() => {
        onRefreshAccount()
      }, 5000)
      
    } catch (error) {
      console.error('Withdrawal failed:', error)
      toast.error('Withdrawal failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleWithdrawStake = async (stakeIndex: number) => {
    const stake = stakes[stakeIndex]
    if (!stake) return

    // Check if early withdrawal (before withdrawal date)
    const now = new Date()
    const isEarlyWithdrawal = now < stake.withdrawalDate

    if (isEarlyWithdrawal) {
      const penalty = await hederaService.calculatePenalty(stake.amount)
      setPenaltyModal({
        isOpen: true,
        stakeIndex,
        amount: stake.amount,
        penalty
      })
      return
    }

    await executeStakeWithdrawal(stakeIndex)
  }

  const executeStakeWithdrawal = async (stakeIndex: number) => {
    if (!hashConnectService) {
      toast.error('Wallet service not available')
      return
    }

    setIsLoading(true)
    try {
      const contractId = import.meta.env.VITE_CONTRACT_ID
      if (!contractId) {
        toast.error('Contract not deployed')
        return
      }

      await hashConnectService.withdrawStakedFromPiggyBank(contractId, stakeIndex)
      
      toast.success('Stake withdrawal transaction submitted!')
      
      // Refresh account data and stakes after a delay
      setTimeout(() => {
        onRefreshAccount()
        loadStakes()
      }, 5000)
      
    } catch (error) {
      console.error('Stake withdrawal failed:', error)
      toast.error('Stake withdrawal failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleEmergencyWithdraw = async () => {
    if (!hashConnectService) {
      toast.error('Wallet service not available')
      return
    }

    if (!confirm('Are you sure you want to emergency withdraw all funds? This will incur a 0.05% penalty.')) {
      return
    }

    setIsLoading(true)
    try {
      const contractId = import.meta.env.VITE_CONTRACT_ID
      if (!contractId) {
        toast.error('Contract not deployed')
        return
      }

      await hashConnectService.emergencyWithdrawFromPiggyBank(contractId)
      
      toast.success('Emergency withdrawal transaction submitted!')
      
      // Refresh account data and stakes after a delay
      setTimeout(() => {
        onRefreshAccount()
        loadStakes()
      }, 5000)
      
    } catch (error) {
      console.error('Emergency withdrawal failed:', error)
      toast.error('Emergency withdrawal failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const formatHbar = (tinybars: number) => {
    return (tinybars / 100000000).toFixed(8) + ' HBAR'
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>Your PiggyBank Dashboard</h2>
        <AccountSummary account={account} />
      </div>

      <div className="dashboard-content">
        <ActionCards
          account={account}
          onDeposit={handleDeposit}
          onStake={handleStake}
          onWithdraw={handleWithdraw}
          onEmergencyWithdraw={handleEmergencyWithdraw}
          isLoading={isLoading}
        />

        <StakesList
          stakes={stakes}
          onWithdrawStake={handleWithdrawStake}
          isLoading={isLoading}
        />
      </div>

      <PenaltyModal
        isOpen={penaltyModal.isOpen}
        amount={penaltyModal.amount}
        penalty={penaltyModal.penalty}
        onConfirm={() => {
          if (penaltyModal.stakeIndex !== undefined) {
            executeStakeWithdrawal(penaltyModal.stakeIndex)
          }
          setPenaltyModal({ ...penaltyModal, isOpen: false })
        }}
        onCancel={() => setPenaltyModal({ ...penaltyModal, isOpen: false })}
      />
    </div>
  )
}

export default Dashboard