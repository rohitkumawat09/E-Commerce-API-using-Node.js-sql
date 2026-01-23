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



//  import pkg from "pg";
// const { Pool } = pkg;
// import dns from "dns";
// import "dotenv/config";

// // 🔥 FORCE IPv4 (THIS IS THE KEY FIX)
// dns.setDefaultResultOrder("ipv4first");

// const db = new Pool({
//   connectionString: process.env.DATABASE_URL,
//   ssl: { rejectUnauthorized: false },
// });

// try {
//   await db.query("SELECT 1");
//   console.log("✅ PostgreSQL connected successfully");
// } catch (error) {
//   console.error("❌ PostgreSQL connection failed:", error.message);
//   process.exit(1);
// }

// export default db;
