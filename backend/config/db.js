import mysql from "mysql2/promise";
import "dotenv/config";

let db;

try {
  db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });

  // 🔍 Test connection once
  await db.query("SELECT 1");
  console.log("✅ MySQL connected successfully");

} catch (error) {
  console.error("❌ MySQL connection failed:", error.message);
  process.exit(1); // stop server if DB fails
}

export default db;
