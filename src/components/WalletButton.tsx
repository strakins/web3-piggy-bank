import React from 'react';
import { useDAppConnector } from './ClientProviders';

export function WalletButton() {
  const { dAppConnector, userAccountId, disconnect, refresh } = useDAppConnector() ?? {};

  const handleLogin = async () => {
    if (dAppConnector) {
      await dAppConnector.openModal();
      if (refresh) refresh();
    }
  };

  const handleDisconnect = () => {
    if (disconnect) {
      void disconnect();
    }
  };

  if (!userAccountId) {
    return (
      <button
        className="btn btn-primary"
        onClick={handleLogin}
        disabled={!dAppConnector}
      >
        Connect Wallet
      </button>
    );
  }

  return (
    <div className="wallet-info">
      <span className="account-display">
        {`${userAccountId.slice(0, 6)}...${userAccountId.slice(-4)}`}
      </span>
      <button
        className="btn btn-secondary"
        onClick={handleDisconnect}
        disabled={!dAppConnector}
      >
        Disconnect
      </button>
    </div>
  );
}