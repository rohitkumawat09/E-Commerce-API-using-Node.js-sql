import jwt from "jsonwebtoken";
import db from "../config/db.js";

const authMiddleware = async (req, res, next) => {
  try {
    const token =
      req.cookies?.token ||
      req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "No token, authorization denied" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch user from SQL
    const [users] = await db.query(
      "SELECT id, name, email, role FROM users WHERE id = ?",
      [decoded.id]
    );

    if (users.length === 0) {
      return res.status(401).json({ error: "User not found" });
    }

    req.user = users[0]; // ✅ attach SQL user
    next();
  } catch (err) {
    console.error("Auth error:", err.message);
    res.status(401).json({ error: "Token is not valid" });
  }
};

export default authMiddleware;
