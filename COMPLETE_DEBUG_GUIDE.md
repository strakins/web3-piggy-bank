# 🚀 Complete Debug Guide - Deposit Balance Not Updating

## What We Fixed

Enhanced logging throughout the entire deposit and balance update flow to help diagnose the issue.

## How to Debug This

### Step 1: Open Browser Console
```
1. Open your app: http://localhost:3001 (or 3000)
2. Press F12 to open Developer Tools
3. Click on the "Console" tab
4. Keep console open while testing
```

### Step 2: Make a Deposit
```
1. Click "Connect Wallet" button (if not connected)
2. Confirm wallet connection
3. Enter deposit amount (e.g., 1.0)
4. Click "Deposit" button
5. Confirm transaction in wallet popup
6. Watch console for logs
```

### Step 3: Read Console Output

#### Expected Success Flow:

**Deposit Transaction Logs:**
```
Starting deposit transaction: { 
  amount: 100000000, 
  accountId: '0.0.123456', 
  contractId: '0.0.4704148' 
}
Transaction built: { amount: '100000000', gas: 300000 }
Executing transaction: { 
  signerWithNetwork: 'hedera:testnet:0.0.123456', 
  txBase64: '0x...' 
}
Deposit transaction result: { 
  transactionId: '0.0.xxx@xxxx.xxx', 
  nodeId: '0.0.3', 
  transactionHash: '0x...' 
}
```

**Account Data Refresh (After 1-3 seconds):**
```
Loading account data for: 0.0.123456
Querying account: { 
  accountId: '0.0.123456', 
  solidityAddress: '0x00000000000000000000000000000000001e240', 
  contractId: '0.0.4704148' 
}
Query result received: [object Object]
Parsed struct values: { 
  balance: '100000000',    ← THIS SHOULD BE YOUR DEPOSIT!
  stakedBalance: '0',
  withdrawalDate: '0',
  exists: true
}
Successfully parsed account data: {...}
Account data loaded: {...}
Updating UI with account data
```

Then UI updates to show balance!

## Common Issues & Solutions

### Issue 1: "Deposit transaction submitted!" But No Update

**Check Console For:**
```
Loading account data for: 0.0.123456
...
Parsed struct values: { 
  balance: '0',          ← PROBLEM: Still zero!
  exists: true
}
```

**Causes:**
1. Deposit was received but account already existed with 0 balance
2. Contract function never received the HBAR
3. Different wallet network than contract

**Solutions:**
- Check wallet is on Testnet
- Verify contract address matches where you sent deposit
- Try clearing browser cache and reconnect

### Issue 2: "Account does not exist on contract"

**Check Console For:**
```
Parsed struct values: { 
  exists: false         ← PROBLEM: Account never created!
}
Account does not exist on contract - returning null
```

**Causes:**
1. Deposit transaction failed silently
2. Wrong contract address
3. Wallet didn't sign transaction properly

**Solutions:**
- Check if wallet showed error during signing
- Verify VITE_CONTRACT_ID is correct
- Try different wallet or reconnect
- Check contract was deployed to testnet

### Issue 3: No Console Logs Appear

**Causes:**
1. Deposit button click didn't trigger
2. Error before logging starts

**Solutions:**
- Check wallet is connected
- Look for error toast message
- Refresh page
- Check if deposit amount is valid

### Issue 4: "Deposit failed. Please try again." Toast

**Causes:**
1. Transaction building failed
2. Wallet signing failed
3. Network issue

**Check Console For:**
```
Deposit transaction error: [specific error]
```

**Solutions:**
- Copy exact error from console
- Verify all .env variables are set
- Check network connectivity
- Try with smaller amount

## Verification Checklist

Before debugging, verify these are set:

```bash
# Check .env file has these:
VITE_WALLET_CONNECT_PROJECT_ID=f5a466b813b93f6face44cb8b9db0571
VITE_CONTRACT_ID=0.0.4704148
```

### Quick Verification Command (in browser console):
```javascript
// This should show your values:
console.log('Contract ID:', import.meta.env.VITE_CONTRACT_ID);
console.log('Project ID:', import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID);
```

## Network Verification

**Wallet Must Be Set to Testnet:**
1. Open HashPack wallet
2. Settings / Network
3. Select **Hedera Testnet** (NOT mainnet!)

**Contract Must Be on Testnet:**
- Contract address: `0.0.4704148`
- Network: Hedera Testnet

## Multi-Point Refresh

The app now refreshes balance 3 times after deposit:

1. **Immediately** - Might be too fast, often shows old data
2. **After 3 seconds** - Usually works, transaction likely finalized
3. **After 8 seconds** - Definitely works, blockchain fully updated

If balance appears at any of these points, it's working!

## Detailed Log Breakdown

### Deposit Logs Explained

```
Starting deposit transaction: {...}
↓ Building the transaction
Transaction built: {amount: '100000000', gas: 300000}
↓ Encoding and signing
Executing transaction: {signerWithNetwork: 'hedera:testnet:0.0.xxx', txBase64: '0x...'}
↓ Wallet processes and signs
Deposit transaction result: {transactionId: '0.0.xxx@xxx', ...}
↓ Transaction completed, now refresh account
```

### Account Query Logs Explained

```
Loading account data for: 0.0.123456
↓ Converting account ID to solidity format
Querying account: {solidityAddress: '0x000...', contractId: '0.0.4704148'}
↓ Calling contract getAccount function
Query result received: [object Object]
↓ Parsing the returned struct
Parsed struct values: {balance: '5000000000', exists: true}
↓ Converting tinybars to proper format
Successfully parsed account data: {balance: 5000000000, ...}
↓ Updating React state
Account data loaded: {...}
Updating UI with account data
↓ UI rerenders with new balance
```

## If All Else Fails

1. **Clear Browser Cache**
   - Ctrl+Shift+Delete (or Cmd+Shift+Delete on Mac)
   - Clear All Time Period
   - Reload page

2. **Disconnect and Reconnect Wallet**
   - Click wallet button
   - Disconnect
   - Wait 5 seconds
   - Reconnect
   - Try deposit again

3. **Restart Dev Server**
   - Stop: Ctrl+C in terminal
   - Restart: `npm run dev`
   - Refresh browser

4. **Check Gas and Fees**
   - Ensure you have enough HBAR
   - Testnet faucet: https://testnet.portal.hedera.com
   - Need: Deposit amount + ~0.5 HBAR for gas

## Report Format (If Still Stuck)

When reporting issues, include:
1. **Exact error message from console**
2. **Screenshot of console logs during deposit**
3. **Your account ID** (from UI)
4. **Contract ID** (from console: `contractId: '...'`)
5. **Network** (showing Testnet?)
6. **Amount deposited**
7. **Whether toast said "submitted" or "failed"**

This will help diagnose the exact issue!
