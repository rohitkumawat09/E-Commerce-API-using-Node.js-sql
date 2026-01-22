# ✅ Complete Payment Flow Guide

## Payment Methods Available

### 1. **Stripe Card Payment** 💳
- Most secure and recommended
- Test Card: `4242 4242 4242 4242`
- Expiry: Any future date (e.g., 12/25)
- CVC: Any 3 digits (e.g., 123)
- After successful payment → Redirects to Success Page
- Order Status: **PAID**

### 2. **UPI** 📱
- Instant order creation
- Order Status: **PENDING**
- Payment Method Code: **U**

### 3. **Net Banking** 🏦
- Instant order creation
- Order Status: **PENDING**
- Payment Method Code: **N**

### 4. **Cash on Delivery (COD)** 📦
- Instant order creation
- Order Status: **PENDING**
- Payment Method Code: **D**

---

## Complete Flow Diagram

```
User Logged In
    ↓
View Product → Add to Cart
    ↓
Click "Checkout"
    ↓
Fill Address & Phone
    ↓
Select Payment Method
    ↓
Click "Place Order"
    ↓
├─→ Stripe: Redirects to /success after payment ✅
├─→ UPI: Creates order immediately ✅
├─→ Net Banking: Creates order immediately ✅
└─→ COD: Creates order immediately ✅
    ↓
Success Page shows:
- "✅ Payment Successful!"
- "View My Orders" button
- "Continue Shopping" button
```

---

## Database Order Status

After any payment method:

| Payment Method | Status in DB | Code |
|---|---|---|
| Stripe (Card) | PAID | C |
| UPI | PENDING | U |
| Net Banking | PENDING | N |
| COD | PENDING | D |

---

## Testing Checklist

✅ **Before Payment:**
- [ ] User is logged in (check username in header)
- [ ] Product is selected with correct quantity
- [ ] Address field is filled
- [ ] Phone field is filled (10+ digits)
- [ ] Payment method is selected

✅ **During Payment:**
- [ ] For Stripe: Payment form opens properly
- [ ] For Stripe: Test card is entered correctly
- [ ] Success message appears after payment

✅ **After Payment:**
- [ ] Redirected to appropriate page
- [ ] Can see order in "My Orders"
- [ ] Order shows correct payment method
- [ ] Order shows correct status (PAID or PENDING)

---

## Troubleshooting

### Problem: "404 Not Found"
**Solution:** 
- Clear browser cache (Ctrl+Shift+Delete)
- Make sure both frontend and backend are running
- Check that you're on http://localhost:5173

### Problem: "❌ Stripe failed to load"
**Solution:**
- Check Frontend/.env has `VITE_STRIPE_PUBLISHABLE_KEY`
- Refresh the page
- Check browser console (F12) for errors

### Problem: "❌ Please select a payment method"
**Solution:**
- Make sure to click on one of the radio buttons
- Reload the form if it doesn't work

### Problem: "❌ Missing required fields"
**Solution:**
- Fill Address field
- Fill Phone field (must be 10+ digits)
- Select a payment method
- Enter quantity (must be > 0)

### Problem: Order appears but status is wrong
**Solution:**
- For non-Stripe methods, status should be "PENDING"
- For Stripe, status should be "PAID"
- Check database query in PAYMENT_TESTING.md

---

## View Orders

After successful payment:

**My Orders:** http://localhost:5173/GetMyOrders
- Shows only your orders
- Shows payment method (N, U, D, C)
- Shows order status

**All Orders (Admin):** http://localhost:5173/AllOrders
- Shows all users' orders
- Admin only view

---

## Success/Cancel Pages

✅ **Success Page (/success)**
- Shows "Payment Successful!" message
- Has "View My Orders" button
- Has "Continue Shopping" button
- Automatically fetches Stripe session to confirm payment

❌ **Cancel Page (/cancel)**
- Shows "Payment Cancelled" message
- Has "Try Again" button
- Has "Continue Shopping" button
- Order is NOT created if payment is cancelled

---

## API Endpoints

### Order Creation
```
POST /orders/create
Body: {
  productId: number,
  quantity: number,
  address: string,
  phone: string,
  paymentMethod: string (upi|netbanking|cod)
}
```

### Stripe Checkout Session
```
POST /payment/create-checkout-session
Body: {
  productId: number,
  quantity: number,
  address: string,
  phone: string
}
Response: { sessionId: string }
```

### Stripe Success Handler
```
POST /payment/stripe-success
Body: { sessionId: string }
Response: { 
  message: string,
  status: string (paid|pending)
}
```

---

## Next Steps

1. ✅ Try each payment method
2. ✅ Check browser console (F12) for errors
3. ✅ View orders in "My Orders" page
4. ✅ Verify order data in database

Happy Ordering! 🎉
