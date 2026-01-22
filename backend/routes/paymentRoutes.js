import express from "express";
import Stripe from "stripe";
import db from "../config/db.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/* ================= CREATE CHECKOUT SESSION ================= */
router.post(
  "/create-checkout-session",
  authMiddleware,
  async (req, res) => {
    try {
      const { productId, quantity = 1, address, phone } = req.body;

      // Validate input
      if (!productId || !quantity || !address || !phone) {
        return res.status(400).json({ error: "Missing required fields: productId, quantity, address, phone" });
      }

      // ✅ Get product from MySQL
      const [[product]] = await db.query(
        "SELECT * FROM products WHERE id = ?",
        [productId]
      );

      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }

      // Validate price
      if (!product.discountedPrice || product.discountedPrice <= 0) {
        return res.status(400).json({ error: "Invalid product price" });
      }

      // ✅ Stripe session
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        line_items: [
          {
            price_data: {
              currency: "inr",
              product_data: {
                name: product.name,
              },
              unit_amount: Math.round(product.discountedPrice * 100),
            },
            quantity,
          },
        ],
        success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.FRONTEND_URL}/cancel`,
        metadata: {
          userId: req.user.id,
          productId,
          quantity,
          address,
          phone,
        },
      });

      res.status(200).json({ sessionId: session.id });
    } catch (err) {
      console.error("Stripe session error:", err);
      res.status(500).json({ error: err.message || "Stripe session failed" });
    }
  }
);

/* ================= WEBHOOK FOR PAYMENT SUCCESS ================= */
router.post("/webhook", express.raw({type: 'application/json'}), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  
  try {
    const event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET || 'whsec_test'
    );

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const { userId, productId, quantity, address, phone } = session.metadata;

      // Map payment method
      const paymentMethodMap = {
        card: "C",
      };

      // Create order in database
      await db.query(
        `INSERT INTO orders 
        (user_id, product_id, quantity, address, phone, payment_method, status)
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          userId,
          productId,
          quantity,
          address,
          phone,
          "C", // Card payment
          "Paid"
        ]
      );

      console.log(`✅ Order created for user ${userId}`);
    }

    res.status(200).json({received: true});
  } catch (err) {
    console.error("Webhook error:", err.message);
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
});

/* ================= VERIFY PAYMENT SESSION ================= */
router.get("/verify-session/:sessionId", authMiddleware, async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.retrieve(req.params.sessionId);
    
    if (session.payment_status === 'paid') {
      res.status(200).json({ 
        status: 'paid',
        message: 'Payment successful! Order has been created.'
      });
    } else {
      res.status(200).json({ 
        status: session.payment_status,
        message: 'Payment not completed yet.'
      });
    }
  } catch (err) {
    console.error("Verification error:", err);
    res.status(500).json({ error: "Failed to verify payment" });
  }
});

/* ================= STRIPE SUCCESS CALLBACK ================= */
router.post("/stripe-success", async (req, res) => {
  try {
    const { sessionId } = req.body;

    if (!sessionId) {
      return res.status(400).json({ error: "Session ID required" });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);
    
    if (session.payment_status === 'paid') {
      res.status(200).json({ 
        message: '✅ Payment Successful! Your order has been created.',
        status: 'paid'
      });
    } else {
      res.status(200).json({ 
        message: '⏳ Payment is still processing...',
        status: session.payment_status
      });
    }
  } catch (err) {
    console.error("Stripe success error:", err);
    res.status(500).json({ error: "Failed to process payment success" });
  }
});

export default router;
