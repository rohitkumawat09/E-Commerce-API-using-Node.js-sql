import express from "express";
import { createOrder, getMyOrders, getAllOrders } from "../controllers/orderController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

const router = express.Router();

router.post("/create", authMiddleware, createOrder);

router.get("/my-orders", authMiddleware, getMyOrders);

// Get all users orders (admin only)
router.get("/all-orders", authMiddleware, adminMiddleware, getAllOrders);

export default router;
