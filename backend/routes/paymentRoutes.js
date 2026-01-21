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

      // ✅ Get product from MySQL
      const [[product]] = await db.query(
        "SELECT * FROM products WHERE id = ?",
        [productId]
      );

      if (!product) {
        return res.status(404).json({ error: "Product not found" });
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
        success_url: `${process.env.FRONTEND_URL}/success`,
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
      res.status(500).json({ error: "Stripe session failed" });
    }
  }
);

export default router;
