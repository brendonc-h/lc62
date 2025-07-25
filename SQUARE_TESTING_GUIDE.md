# Square Payment Testing Guide

## ✅ **Changes Made:**

### **1. Sauce Type Options Added**
- ✅ Added `sauceTypeOptions: true` to all breakfast meals
- ✅ Added interactive Red/Green sauce radio buttons in order page
- ✅ Sauce selection included in cart special requests

### **2. Square Payment Debugger Added**
- ✅ Created `SquarePaymentDebugger` component for real-time debugging
- ✅ Shows Square SDK status, card instance, button state, environment vars
- ✅ Only appears in development mode during checkout
- ✅ Provides test buttons for connection testing

## 🧪 **Testing Strategy for Square Payments**

### **Phase 1: Environment Verification**

**Check Environment Variables:**
```bash
# Verify these are set correctly for PRODUCTION:
NEXT_PUBLIC_SQUARE_APP_ID=sandbox-sq0idb-... (should be production app ID)
NEXT_PUBLIC_SQUARE_LOCATION_ID=L... (production location ID)
SQUARE_ACCESS_TOKEN=EAAAl... (production access token)
SQUARE_LOCATION_ID=L... (production location ID)
```

**⚠️ CRITICAL: Since you're testing production, make sure:**
- App ID is production (not sandbox)
- Access token is production (not sandbox)
- Location ID matches your actual Square location

### **Phase 2: Frontend Testing**

**1. Basic Order Flow:**
```
1. Add items to cart → Check cart state
2. Proceed to checkout → Verify order details  
3. Fill customer info → Test validation
4. Click "Continue to Payment" → Check Square form loads
5. Use debugger to verify all components ready
```

**2. Square Payment Form Testing:**
```
1. Open browser dev tools console
2. Watch for Square SDK loading messages
3. Check debugger shows:
   - ✅ Square SDK: Loaded
   - ✅ Card Instance: Ready  
   - ✅ Initialized: Yes
   - ✅ Can Click: Yes
```

**3. Payment Button Issues Debugging:**
```javascript
// Add this to browser console to debug button state:
console.log('Payment button debug:', {
  squareLoaded: !!window.Square,
  cardReady: !!document.querySelector('#card-container input'),
  buttonDisabled: document.querySelector('button[disabled]'),
  networkOnline: navigator.onLine
});
```

### **Phase 3: Production Payment Testing**

**⚠️ IMPORTANT: Use REAL payment methods for production testing**

**Test Cards for Production (REAL CHARGES):**
- Use your own credit/debit card
- Start with small amounts ($1.00)
- Test different card types (Visa, Mastercard, Amex)

**Test Scenarios:**
1. **Successful Payment ($1.00 test)**
   - Use valid card with sufficient funds
   - Verify payment appears in Square dashboard
   - Check order is recorded in database

2. **Declined Card**
   - Use card with insufficient funds
   - Verify error handling works
   - Ensure cart state is preserved

3. **Network Issues**
   - Test with slow/intermittent connection
   - Verify timeout handling
   - Check retry functionality

### **Phase 4: Square Dashboard Verification**

**After Each Test Payment:**
1. Log into Square Dashboard
2. Go to Transactions → Payments
3. Verify payment appears with correct:
   - Amount
   - Customer info
   - Order details
   - Status (Completed/Failed)

### **Phase 5: Error Scenarios Testing**

**Common Issues to Test:**
```javascript
// 1. Square SDK not loading
// Check network tab for failed requests

// 2. Card tokenization failing  
// Watch console for tokenization errors

// 3. Backend payment processing failing
// Check API response in network tab

// 4. Environment variable issues
// Use debugger to verify config
```

### **Phase 6: Mobile Testing**

**Mobile-Specific Tests:**
- Test on actual mobile devices
- Check touch interactions with payment form
- Verify keyboard behavior
- Test different mobile browsers

### **Phase 7: Performance Testing**

**Load Testing:**
- Large orders ($100+)
- Multiple rapid clicks
- Concurrent users (if possible)
- Payment form under slow connections

## 🔧 **Debugging Tools**

### **1. Square Payment Debugger (Built-in)**
- Appears in bottom-right during checkout (dev mode)
- Real-time status monitoring
- Test connection buttons
- Environment variable verification

### **2. Browser Console Commands**
```javascript
// Check Square SDK status
console.log('Square SDK:', !!window.Square);

// Test card tokenization
if (window.Square) {
  // This will be available after card is initialized
  console.log('Square payments available');
}

// Check environment
console.log('Environment:', {
  appId: process.env.NEXT_PUBLIC_SQUARE_APP_ID,
  locationId: process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID,
  nodeEnv: process.env.NODE_ENV
});
```

### **3. Network Tab Monitoring**
Watch for these requests:
- Square SDK loading: `connect.squareup.com`
- Payment processing: `/api/square-payment-direct`
- Tokenization: Square's payment endpoints

## 🚨 **Common Issues & Solutions**

### **"Can't Click Payment Button"**
**Possible Causes:**
1. Square SDK not loaded → Check network tab
2. Card not initialized → Check console errors  
3. Button disabled state → Verify all conditions met
4. Environment variables missing → Use debugger

### **"Payment Processing Failed"**
**Check:**
1. Production vs Sandbox environment mismatch
2. Access token permissions
3. Location ID correctness
4. Network connectivity

### **"Card Validation Failed"**
**Verify:**
1. Card form properly loaded
2. All required fields filled
3. Valid card number format
4. Expiry date not in past

## 📋 **Testing Checklist**

**Before Testing:**
- [ ] Environment variables set for production
- [ ] Square dashboard access confirmed
- [ ] Test payment method ready
- [ ] Browser dev tools open

**During Testing:**
- [ ] Square debugger shows all green checkmarks
- [ ] Console shows no errors
- [ ] Payment form loads completely
- [ ] Button becomes clickable

**After Testing:**
- [ ] Payment appears in Square dashboard
- [ ] Order recorded in database
- [ ] Customer receives confirmation
- [ ] Error handling works for failures

## 🎯 **Next Steps**

1. **Start with $1.00 test payment** using your own card
2. **Monitor Square debugger** for any red indicators
3. **Check Square dashboard** for transaction
4. **Test error scenarios** with invalid cards
5. **Deploy and test on production** environment

**Ready to test! The debugger will help identify exactly what's preventing the payment button from working.** 🚀
