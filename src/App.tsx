import { useState, useEffect, useCallback } from 'react'
import { toast } from 'react-hot-toast'
import { ClientProviders, useDAppConnector } from './components/ClientProviders'
import { WalletButton } from './components/WalletButton'
import Dashboard from './components/Dashboard'
import { ModernHederaService } from './services/ModernHederaService'
import { PiggyBankAccount } from './types'

function HomePage() {
  const currentYear = new Date().getFullYear()

  return (
    <div className="app app-home">
      <div className="orb orb-one" />
      <div className="orb orb-two" />

      <header className="header home-header">
        <div className="container">
          <div className="nav">
            <h1 className="logo">🐷 PiggyBank</h1>
            <div className="nav-actions">
              <WalletButton />
            </div>
          </div>
        </div>
      </header>

      <main className="main home-main">
        <section className="hero-section" id="home">
          <div className="container hero-layout">
            <div className="hero-copy">
              <span className="hero-badge animate-in">Hedera-native savings</span>
              <h2 className="hero-title animate-in animate-delay-1">
                Grow your HBAR with automated staking
              </h2>
              <p className="hero-subtitle animate-in animate-delay-2">
                Manage deposits, schedule stakes, and unlock rewards without surrendering custody.
                PiggyBank gives you a transparent Hedera dashboard with powerful treasury tooling
                built for individuals and teams.
              </p>
              <div className="hero-actions animate-in animate-delay-3">
                <WalletButton />
                <a className="hero-link btn-add" href="#learn-more">
                  Explore the platform
                </a>
              </div>
              <div className="hero-stats">
                <div className="stat-card animate-in animate-delay-3">
                  <span className="stat-value">0.05%</span>
                  <span className="stat-label">Early exit cost</span>
                </div>
                <div className="stat-card animate-in animate-delay-4">
                  <span className="stat-value">24/7</span>
                  <span className="stat-label">On-chain availability</span>
                </div>
                <div className="stat-card animate-in animate-delay-5">
                  <span className="stat-value">100%</span>
                  <span className="stat-label">Self-custodied funds</span>
                </div>
              </div>
            </div>

            <div className="hero-visual animate-in animate-delay-4">
              <div className="floating-card floating-card-primary">
                <h4>Live savings insights</h4>
                <p>
                  Track deposits, scheduled stakes, and projected rewards backed by Hedera smart
                  contracts.
                </p>
              </div>
              <div className="floating-card floating-card-secondary">
                <h4>Smart withdrawal windows</h4>
                <p>
                  Set future unlock dates and get notified when it is time to restake or withdraw.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="feature-section" id="learn-more">
          <div className="container">
            <div className="section-heading animate-in animate-delay-1">
              <span className="section-eyebrow">Why PiggyBank</span>
              <h3 className="section-title">Modern treasury tools for everyday savers</h3>
              <p className="section-subtitle">
                When you combine Hedera&apos;s consistency with transparent staking automation,
                you get a savings experience that feels instant, predictable, and endlessly
                scalable.
              </p>
            </div>

            <div className="feature-grid">
              <article className="feature-card animate-in animate-delay-1">
                <span className="feature-icon">🛡️</span>
                <h4>Self-custodial security</h4>
                <p>
                  Only you control deposits and stakes. PiggyBank connects directly to your Hedera
                  wallet—no shared custody, no middlemen.
                </p>
              </article>
              <article className="feature-card animate-in animate-delay-2">
                <span className="feature-icon">⚙️</span>
                <h4>Automated staking flows</h4>
                <p>
                  Schedule deposits, stake instantly, and redeploy matured positions with guided
                  workflows that keep capital productive.
                </p>
              </article>
              <article className="feature-card animate-in animate-delay-3">
                <span className="feature-icon">📊</span>
                <h4>Transparent analytics</h4>
                <p>
                  Monitor balances, staking history, and penalties in one place with real-time data
                  pulled from the Hedera network.
                </p>
              </article>
              <article className="feature-card animate-in animate-delay-4">
                <span className="feature-icon">🤝</span>
                <h4>Collaborative tooling</h4>
                <p>
                  Share your progress with teammates and keep everyone in sync with auditable
                  on-chain transaction records.
                </p>
              </article>
            </div>
          </div>
        </section>

        <section className="panels-section">
          <div className="container panels-grid">
            <div className="panel-card animate-in">
              <h3>How it works</h3>
              <ul className="step-list">
                <li>
                  <span className="step-index">1</span>
                  <div>
                    <h4>Connect your wallet</h4>
                    <p>Use HashPack, Blade, or any WalletConnect-ready Hedera wallet.</p>
                  </div>
                </li>
                <li>
                  <span className="step-index">2</span>
                  <div>
                    <h4>Deposit and stake</h4>
                    <p>
                      Add HBAR to your piggybank, define withdrawal windows, and deploy stakes in a
                      few clicks.
                    </p>
                  </div>
                </li>
                <li>
                  <span className="step-index">3</span>
                  <div>
                    <h4>Track and optimize</h4>
                    <p>
                      Monitor balances, penalties, and performance with the dashboard&apos;s
                      real-time analytics.
                    </p>
                  </div>
                </li>
              </ul> 
            </div>

            <div className="panel-card panel-card-highlight animate-in animate-delay-1">
              <h3>Why Hedera + PiggyBank?</h3>
              <p>
                Hedera&apos;s consensus guarantees blazing-fast finality and predictable fees while
                PiggyBank layers on an intuitive experience for decentralized saving.
              </p>
              <div className="panel-list">
                <div>
                  <h4>Predictable fees</h4>
                  <p>Fractions of a cent per transaction keep your savings compounding.</p>
                </div>
                <div>
                  <h4>Green & sustainable</h4>
                  <p>Lowest energy profile of any major network, verified by third parties.</p>
                </div>
                <div>
                  <h4>Battle-tested contracts</h4>
                  <p>Audited smart contracts built specifically for Hedera&apos;s staking model.</p>
                </div>
              </div>
            </div>

            <div className="panel-card animate-in animate-delay-2">
              <h3>Built for momentum</h3>
              <ul className="benefits-list">
                <li>Instant balance refresh with multiple snapshots after each transaction.</li>
                <li>Penalty simulator helps you plan early exits before committing.</li>
                <li>Custom withdrawal scheduling keeps future goals on track.</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="cta-section">
          <div className="container">
            <div className="cta-card animate-in">
              <h3>Ready to build your decentralized savings plan?</h3>
              <p>
                Connect a wallet to create your Hedera piggybank, deposit HBAR, and start staking in
                minutes.
              </p>
              <div className="hero-actions">
                <WalletButton />
                <span className="cta-caption">No custodians. You stay in control of every move.</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container footer-content">
          <p>© {currentYear} PiggyBank on Hedera. Secure savings for builders.</p>
        </div>
      </footer>
    </div>
  )
}

function AppContent() {
  const { dAppConnector, userAccountId } = useDAppConnector() ?? {}
  const [account, setAccount] = useState<PiggyBankAccount | null>(null)
  const [hederaService, setHederaService] = useState<ModernHederaService | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const initializeHedera = () => {
    if (dAppConnector) {
      const hedera = new ModernHederaService('testnet')
      hedera.setDAppConnector(dAppConnector)
      
      const contractId = import.meta.env.VITE_CONTRACT_ID
      if (contractId) {
        hedera.setContractId(contractId)
      }
      
      setHederaService(hedera)
    }
  }

  const loadAccountData = useCallback(async (accountId: string) => {
    if (!hederaService) {
      console.log('HederaService not initialized');
      setIsLoading(false); // Ensure loading is false when service not ready
      return;
    }
    
    try {
      console.log('Loading account data for:', accountId);
      setIsLoading(true);

      // Add timeout to prevent infinite loading
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Account query timeout after 30 seconds')), 30000)
      );

      const accountDataPromise = hederaService.getAccount(accountId);
      const accountData = await Promise.race([accountDataPromise, timeoutPromise]) as any;
      
      console.log('Account data loaded:', accountData);
      
      if (accountData) {
        console.log('Updating UI with account data');
        setAccount(accountData);
      } else {
        console.log('No account data returned - account may not exist on contract');
        setAccount(null);
      }
    } catch (error) {
      console.error('Failed to load account data:', error);
      setAccount(null);
    } finally {
      console.log('Finishing account data load, setting loading to false');
      setIsLoading(false);
    }
  }, [hederaService])

  useEffect(() => {
    initializeHedera()
  }, [dAppConnector])

  useEffect(() => {
    if (userAccountId && hederaService) {
      console.log('UserAccount and HederaService ready, loading account data');
      loadAccountData(userAccountId);
    } else if (!userAccountId) {
      console.log('No user account, resetting states');
      setAccount(null);
      setIsLoading(false);
    }
  }, [userAccountId, hederaService, loadAccountData])

  const refreshAccountData = async () => {
    if (userAccountId) {
      await loadAccountData(userAccountId)
    }
  }

  // Simplified transaction handlers
  const handleDeposit = async (amount: number) => {
    if (!hederaService || !userAccountId) {
      toast.error('Wallet not connected')
      return
    }

    try {
      setIsLoading(true)
      const hbarAmount = Math.floor(amount * 100000000) // Convert HBAR to tinybars
      await hederaService.deposit(hbarAmount, userAccountId)
      
      toast.success('Deposit transaction submitted!')
      // Refresh immediately, then again after 3 seconds, then after 8 seconds
      await refreshAccountData()
      setTimeout(() => refreshAccountData(), 3000)
      setTimeout(() => refreshAccountData(), 8000)
    } catch (error) {
      console.error('Deposit failed:', error)
      toast.error('Deposit failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleStake = async (amount: number, withdrawalDate: Date) => {
    if (!hederaService || !userAccountId) {
      toast.error('Wallet not connected')
      return
    }

    try {
      setIsLoading(true)
      const hbarAmount = Math.floor(amount * 100000000)
      await hederaService.stake(hbarAmount, withdrawalDate, userAccountId)
      
      toast.success('Stake transaction submitted!')
      // Refresh immediately, then again after 3 seconds, then after 8 seconds
      await refreshAccountData()
      setTimeout(() => refreshAccountData(), 3000)
      setTimeout(() => refreshAccountData(), 8000)
    } catch (error) {
      console.error('Stake failed:', error)
      toast.error('Stake failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleWithdraw = async (amount: number) => {
    if (!hederaService || !userAccountId) {
      toast.error('Wallet not connected')
      return
    }

    try {
      setIsLoading(true)
      const hbarAmount = Math.floor(amount * 100000000)
      await hederaService.withdraw(hbarAmount, userAccountId)
      
      toast.success('Withdrawal transaction submitted!')
      // Refresh immediately, then again after 3 seconds, then after 8 seconds
      await refreshAccountData()
      setTimeout(() => refreshAccountData(), 3000)
      setTimeout(() => refreshAccountData(), 8000)
    } catch (error) {
      console.error('Withdrawal failed:', error)
      toast.error('Withdrawal failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (!userAccountId) {
    return (
      <HomePage />
    )
  }

  return (
    <div className="app app-dashboard">
      <div className="orb orb-dashboard" />

      <header className="header dashboard-header">
        <div className="container">
          <div className="nav">
            <h1 className="logo">🐷 PiggyBank</h1>
            <div className="nav-actions">
              <WalletButton />
            </div>
          </div>
        </div>
      </header>
      
      <main className="main dashboard-main">
        <div className="container">
          <Dashboard
            account={account}
            userAccountId={userAccountId}
            isLoading={isLoading}
            onDeposit={handleDeposit}
            onStake={handleStake}
            onWithdraw={handleWithdraw}
            onRefreshAccount={refreshAccountData}
          />
        </div>
      </main>
    </div>
  )
}

function App() {
  return (
    <ClientProviders>
      <AppContent />
    </ClientProviders>
  )
}

export default App
