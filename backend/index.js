import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";

import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./swagger.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

/* ================= CORS ================= */
const allowedOrigins = [


   process.env.FRONTEND_URL,
  process.env.LOCAL_URL,
  process.env.DEPLOYED_FRONTEND_URL,
  process.env.VERCEL_URL,
  "http://localhost:5173",
  "http://localhost:4000",
  "http://127.0.0.1:5500",
 
 "http://localhost:3000",
 "https://1scxwl1x-5173.inc1.devtunnels.ms",
 "https://e-commerce-frontend-phi.vercel.app"
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

/* ================= MIDDLEWARE ================= */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

/* ================= SWAGGER ================= */
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/* ================= ROUTES ================= */
app.use("/user", userRoutes);
app.use("/product", productRoutes);
app.use("/orders", orderRoutes);
app.use("/payment", paymentRoutes);

/* ================= SERVER ================= */
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
