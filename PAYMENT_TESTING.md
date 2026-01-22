# Payment Testing Guide

## Prerequisites
1. Make sure you are **LOGGED IN** before trying to place an order
2. Both Frontend (http://localhost:5173) and Backend (http://localhost:4000) are running

## Testing Each Payment Method

### 1. **UPI Payment** (Non-Stripe)
- Select "📱 UPI" option
- Fill Address, Phone, Quantity
- Click "Place Order"
- ✅ Order should be created with status "Pending" and payment_method = "U"

### 2. **Net Banking** (Non-Stripe)
- Select "🏦 Net Banking" option
- Fill Address, Phone, Quantity
- Click "Place Order"
- ✅ Order should be created with status "Pending" and payment_method = "N"

### 3. **Cash on Delivery** (Non-Stripe)
- Select "📦 Cash on Delivery" option
- Fill Address, Phone, Quantity
- Click "Place Order"
- ✅ Order should be created with status "Pending" and payment_method = "D"

### 4. **Stripe Card Payment**
- Select "💳 Stripe (Card Payment)" option
- Fill Address, Phone, Quantity
- Click "Place Order"
- Use test card: **4242 4242 4242 4242**
- Expiry: Any future date (e.g., 12/25)
- CVC: Any 3 digits (e.g., 123)
- ✅ You'll be redirected to Stripe Checkout
- ✅ Order should be created with status "Paid" and payment_method = "C"

## Debug Tips

### Check Browser Console (F12)
- Look for console.log messages showing:
  - "Starting Stripe payment..."
  - "Creating order with payment method: upi"
  - "Order response:" with the response data

### Check Backend Console
- Look for error messages in the backend terminal
- Should show validation errors if fields are missing

### Common Issues

1. **"❌ Please select a payment method"**
   - Make sure to select a payment method option before clicking "Place Order"

2. **"❌ Missing required fields"**
   - Check that Address, Phone, and Quantity are all filled

3. **"❌ Product not found"**
   - The product ID might be invalid
   - Check if the product exists in the database

4. **"❌ Stripe failed to load"**
   - Check if `VITE_STRIPE_PUBLISHABLE_KEY` is in Frontend/.env
   - Check if Stripe.js is loaded in index.html (should see script tag)

5. **"❌ Unauthorized"** or **"❌ 401"**
   - Make sure you're logged in
   - Check browser DevTools > Application > Cookies for auth tokens

## Database Check

Run this SQL query to verify orders were created:

```sql
SELECT id, user_id, product_id, payment_method, status, created_at 
FROM orders 
ORDER BY created_at DESC 
LIMIT 10;
```

Payment methods should show:
- "N" for Net Banking
- "U" for UPI
- "D" for Cash on Delivery
- "C" for Card (Stripe)
