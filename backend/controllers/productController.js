import db from "../config/db.js";
import cloudinary from "../config/cloudinary.js";

/* ================= IMAGE UPLOAD ================= */
const uploadImage = buffer =>
  new Promise((resolve, reject) =>
    cloudinary.uploader.upload_stream(
      { folder: "products" },
      (e, r) => (r ? resolve(r.secure_url) : reject(e))
    ).end(buffer)
  );

/* ================= CREATE PRODUCT ================= */
export const createForm = async (req, res) => {
  try {
    const image = req.file ? await uploadImage(req.file.buffer) : null;

    const {
      name,
      description,
      originalPrice,
      discountedPrice,
      category,
      slug
    } = req.body;

    await db.query(
      `INSERT INTO products
      (name, description, originalPrice, discountedPrice, category, slug, image)
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [name, description, originalPrice, discountedPrice, category, slug, image]
    );

    res.status(201).json({ message: "Product created" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ================= GET ALL PRODUCTS ================= */
export const getAllProducts = async (req, res) => {
  const [rows] = await db.query("SELECT * FROM products");
  res.json(rows);
};

/* ================= GET PRODUCT BY ID ================= */
export const getAllProductsid = async (req, res) => {
  const [rows] = await db.query(
    "SELECT * FROM products WHERE id=?",
    [req.params.id]
  );

  if (!rows.length) {
    return res.status(404).json({ error: "Product not found" });
  }

  res.json(rows[0]);
};

/* ================= DELETE PRODUCT ================= */
export const deleteProduct = async (req, res) => {
  await db.query("DELETE FROM products WHERE id=?", [req.params.id]);
  res.json({ message: "Product deleted" });
};

/* ================= UPDATE PRODUCT ================= */
export const updateProduct = async (req, res) => {
  const image = req.file ? await uploadImage(req.file.buffer) : null;
  const { name, description, originalPrice, discountedPrice } = req.body;

  await db.query(
    `UPDATE products
     SET name=?, description=?, originalPrice=?, discountedPrice=?, image=?
     WHERE id=?`,
    [name, description, originalPrice, discountedPrice, image, req.params.id]
  );

  res.json({ message: "Product updated" });
};

/* ================= CART ================= */
export const CartData = async (req, res) => {
  try {
    const { quantity } = req.body;
    const productId = req.params.id;
    const userId = req.user.id;

    // If quantity is provided, use it; otherwise increment by 1
    const qty = quantity || 1;

    await db.query(
      `INSERT INTO cart (user_id, product_id, quantity)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE quantity = ?`,
      [userId, productId, qty, qty]
    );

    res.json({ message: "Cart updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getCartData = async (req, res) => {
  const [cartItems] = await db.query(
    `SELECT p.id, p.name, p.description, p.originalPrice, p.discountedPrice, p.category, p.slug, p.image, c.quantity,
            c.user_id, c.product_id
     FROM cart c
     JOIN products p ON c.product_id = p.id
     WHERE c.user_id = ?`,
    [req.user.id]
  );

  // Transform response to match frontend expectations
  const cart = cartItems.map(item => ({
    product: {
      id: item.id,
      name: item.name,
      description: item.description,
      originalPrice: item.originalPrice,
      discountedPrice: item.discountedPrice,
      category: item.category,
      slug: item.slug,
      image: item.image
    },
    quantity: item.quantity
  }));

  res.json({ cart });
};

export const removeFromCart = async (req, res) => {
  await db.query(
    "DELETE FROM cart WHERE user_id=? AND product_id=?",
    [req.user.id, req.params.id]
  );

  res.json({ message: "Removed from cart" });
};

/* ================= WISHLIST ================= */
export const wishlist = async (req, res) => {
  await db.query(
    "INSERT IGNORE INTO wishlist (user_id, product_id) VALUES (?, ?)",
    [req.user.id, req.params.id]
  );

  res.json({ message: "Wishlist updated" });
};

export const getWishlistData = async (req, res) => {
  const [wishlistItems] = await db.query(
    `SELECT p.id, p.name, p.description, p.originalPrice, p.discountedPrice, p.category, p.slug, p.image
     FROM wishlist w
     JOIN products p ON w.product_id = p.id
     WHERE w.user_id=?`,
    [req.user.id]
  );

  // Transform response to match frontend expectations
  const wishlist = wishlistItems.map(item => ({
    product: {
      id: item.id,
      name: item.name,
      description: item.description,
      originalPrice: item.originalPrice,
      discountedPrice: item.discountedPrice,
      category: item.category,
      slug: item.slug,
      image: item.image
    }
  }));

  res.json({ wishlist });
};

export const wishListRemoveData = async (req, res) => {
  await db.query(
    "DELETE FROM wishlist WHERE user_id=? AND product_id=?",
    [req.user.id, req.params.id]
  );

  res.json({ message: "Removed from wishlist" });
};
