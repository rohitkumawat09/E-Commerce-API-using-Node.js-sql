import db from "../config/db.js";

/* ================= CREATE ORDER ================= */
export const createOrder = async (req, res) => {
  try {
    const { productId, quantity, address, phone, paymentMethod } = req.body;
    const userId = req.user.id;

    // Check product exists
    const [product] = await db.query(
      "SELECT id FROM products WHERE id = ?",
      [productId]
    );

    if (product.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Insert order
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
        paymentMethod,
        "Pending"
      ]
    );

    res.status(201).json({ message: "Order placed successfully" });

  } catch (error) {
    console.error("Order creation error:", error);
    res.status(500).json({ error: "Failed to place order" });
  }
};

/* ================= GET MY ORDERS ================= */
export const getMyOrders = async (req, res) => {
  try {
    const userId = req.user.id;

    const [orders] = await db.query(
      `SELECT 
        o.id,
        o.quantity,
        o.address,
        o.phone,
        o.payment_method,
        o.status,
        o.created_at,
        p.name,
        p.originalPrice,
        p.discountedPrice,
        p.image
      FROM orders o
      JOIN products p ON o.product_id = p.id
      WHERE o.user_id = ?
      ORDER BY o.created_at DESC`,
      [userId]
    );

    res.json(orders);

  } catch (error) {
    console.error("Error fetching my orders:", error);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
};

/* ================= GET ALL ORDERS (ADMIN) ================= */
export const getAllOrders = async (req, res) => {
  try {
    const [orders] = await db.query(
      `SELECT 
        u.name AS userName,
        u.email,
        o.id AS orderId,
        o.quantity,
        o.address,
        o.phone,
        o.payment_method,
        o.status,
        o.created_at,
        p.name AS productName,
        p.originalPrice,
        p.discountedPrice,
        p.image
      FROM orders o
      JOIN users u ON o.user_id = u.id
      JOIN products p ON o.product_id = p.id
      ORDER BY o.created_at DESC`
    );

    res.json(orders);

  } catch (error) {
    console.error("Error fetching all orders:", error);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
};
