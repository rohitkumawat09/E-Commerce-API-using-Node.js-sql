
import express from "express";
import {
  getAllProducts,
  createForm,
  getAllProductsid,
  CartData,
  getCartData,
  removeFromCart,
  wishlist,
  getWishlistData,
  wishListRemoveData,
  updateProduct,
deleteProduct
} from "../controllers/productController.js";
import authMiddleware from "../middleware/authMiddleware.js";


import adminMiddleware from "../middleware/adminMiddleware.js";



import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Product
 *   description: Product management and e-commerce operations
 */

/**
 * @swagger
 * /product/add:
 *   post:
 *     summary: Create a new product with image upload
 *     tags: [Product]
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               originalPrice:
 *                 type: number
 *               discountedPrice:
 *                 type: number
 *               category:
 *                 type: string
 *               slug:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Product created successfully
 *       500:
 *         description: Product creation failed
 */
router.post("/add", authMiddleware, adminMiddleware, upload.single("image"), createForm);


/**
 * @swagger
 * /product/productsdetails:
 *   get:
 *     summary: Get all products
 *     tags: [Product]
 *     responses:
 *       200:
 *         description: List of all products
 *       500:
 *         description: Failed to fetch products
 */
router.get("/productsdetails", getAllProducts);

/**
 * @swagger
 * /product/productsdetails/{id}:
 *   get:
 *     summary: Get a single product by ID
 *     tags: [Product]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product found
 *       404:
 *         description: Product not found
 */
router.get("/productsdetails/:id", getAllProductsid);

/**
 * @swagger
 * /product/cart/{id}:
 *   post:
 *     summary: Add product to cart
 *     tags: [Product]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Product added to cart
 *       401:
 *         description: Unauthorized
 */
router.post("/cart/:id", authMiddleware, CartData);

/**
 * @swagger
 * /product/cart/data:
 *   get:
 *     summary: Get cart data
 *     tags: [Product]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart data retrieved
 *       401:
 *         description: Unauthorized
 */
router.get("/cart/data", authMiddleware, getCartData);

/**
 * @swagger
 * /product/cart/{id}:
 *   delete:
 *     summary: Remove product from cart
 *     tags: [Product]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Product removed from cart
 *       401:
 *         description: Unauthorized
 */
router.delete("/cart/:id", authMiddleware, removeFromCart);

/**
 * @swagger
 * /product/wishlist/{id}:
 *   post:
 *     summary: Add product to wishlist
 *     tags: [Product]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Product added to wishlist
 *       401:
 *         description: Unauthorized
 */
router.post("/wishlist/:id", authMiddleware, wishlist);

/**
 * @swagger
 * /product/wishlist/Data:
 *   get:
 *     summary: Get wishlist data
 *     tags: [Product]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Wishlist data retrieved
 *       401:
 *         description: Unauthorized
 */
router.get("/wishlist/Data", authMiddleware, getWishlistData);

/**
 * @swagger
 * /product/wishList/remove/{id}:
 *   delete:
 *     summary: Remove product from wishlist
 *     tags: [Product]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Product removed from wishlist
 *       401:
 *         description: Unauthorized
 */
router.delete("/wishList/remove/:id", authMiddleware, wishListRemoveData);


router.put(
  "/product/edit/:id",
  authMiddleware,       
  adminMiddleware,   
  upload.single("image"),
  updateProduct
);


router.delete(
  "/delete/:id",
  authMiddleware,
  adminMiddleware,
  deleteProduct
);







export default router;
