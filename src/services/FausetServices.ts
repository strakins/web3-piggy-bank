// services/FaucetService.ts
export class FaucetService {
  async requestTestTokens(accountId: string): Promise<{ success: boolean; message: string }> {
    if (!accountId) {
      throw new Error('Account ID is required');
    }

    try {
      // Hedera Portal Faucet - most reliable
      const response = await fetch('https://portal.hedera.com/api/v1/faucet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          accountId: accountId,
          network: 'testnet'
        }),
      });

      const data = await response.json();

      if (response.status === 429) {
        return {
          success: false,
          message: 'Rate limit exceeded. Please try again in 24 hours.'
        };
      }

      if (!response.ok) {
        return {
          success: false,
          message: data.message || `Faucet request failed: ${response.status}`
        };
      }

      return {
        success: true,
        message: '100 HBAR test tokens requested! They should arrive in your wallet shortly.'
      };
    } catch (error) {
      console.error('Faucet request failed:', error);
      return {
        success: false,
        message: 'Failed to connect to faucet service. Please try again later.'
      };
    }
  }
}