# 🐛 Troubleshooting Guide - Hedera PiggyBank Deposit

## If Deposit Still Fails

### 1. **Check Browser Console for Detailed Error**
   1. Open DevTools (F12 or Cmd+Option+I)
   2. Go to Console tab
   3. Try deposit again
   4. Look for error message containing:
      - Network issues
      - Contract call problems
      - Wallet signing failures

### 2. **Verify Contract ID is Correct**
   ```
   .env file should contain:
   VITE_CONTRACT_ID=0.0.4704148
   ```
   
   If this value is missing or incorrect:
   - Update it with actual contract address
   - Restart dev server: `npm run dev`

### 3. **Verify Wallet is Connected**
   - Check that account ID is displayed after "Connect Wallet"
   - Should show format: `0.0.xxxx` or `hedera:testnet:0.0.xxxx`
   - If not connected, click "Connect Wallet" again

### 4. **Check Account Has Sufficient HBAR**
   - Testnet account needs enough HBAR for:
     - Deposit amount
     - Gas fees (~1-5 HBAR per transaction)
   - Get free testnet HBAR from: https://testnet.portal.hedera.com

### 5. **Verify Network is Testnet**
   - The .env shows `VITE_HEDERA_NETWORK=testnet`
   - Wallet should also be set to Hedera Testnet
   - Go to HashPack settings and select "Testnet"

### 6. **Check Transaction Response**
   After clicking Deposit, watch for these messages:
   - ✅ **Success**: "Deposit transaction submitted!"
   - ❌ **Error**: "Deposit failed. Please try again." (check browser console)

### 7. **Common Error Messages & Solutions**

#### "Contract not deployed or wallet not connected"
- Make sure wallet is connected
- Verify VITE_CONTRACT_ID is set

#### "No signer available from wallet connection"
- Disconnect and reconnect wallet
- Check if HashPack is properly installed
- Try refreshing the page

#### "Transaction failed precheck"
- Insufficient HBAR balance for gas
- Network connectivity issue
- Check account has HBAR

#### "Signer not found for account ID"
- Account format issue with network prefix
- Should be formatted as: `hedera:testnet:0.0.xxx`
- This is now handled automatically

### 8. **Debug Mode - Check Service**
Open browser console and run:
```javascript
// These will show in console if you add them to App.tsx temporarily
console.log('Contract ID:', import.meta.env.VITE_CONTRACT_ID)
console.log('Wallet Connected:', !!userAccountId)
console.log('Account ID:', userAccountId)
```

### 9. **Restart Everything**
Sometimes a fresh start fixes issues:
```bash
# Kill dev server
pkill -f "npm run dev"

# Clear node_modules cache
rm -rf node_modules/.vite

# Restart
npm run dev
```

### 10. **Check Network Connectivity**
Test Hedera network availability:
```bash
# In terminal
curl https://testnet.hashio.io/api

# Should return a response, not timeout
```

## Getting More Help

1. **Check Console Logs**: Browser DevTools → Console
2. **Check Terminal Logs**: Where you ran `npm run dev`
3. **Look at React DevTools**: If installed, check component state
4. **Verify Contract Address**: Is it deployed on testnet?

## Success Indicators

When deposit works correctly:
1. ✅ Wallet connection shows your account ID
2. ✅ Deposit button is clickable
3. ✅ Clicking deposit shows toast message (bottom right)
4. ✅ Wallet prompts you to confirm transaction
5. ✅ After confirmation, you see "Deposit transaction submitted!"
6. ✅ After ~30 seconds, balance updates

## Still Having Issues?

Double-check these files are correct:
- `/src/services/ModernHederaService.ts` - Has correct signAndExecuteTransaction logic
- `/src/App.tsx` - Properly calls hederaService.deposit()
- `/.env` - Contains VITE_CONTRACT_ID
- `/src/components/ClientProviders.tsx` - DAppConnector is initialized
