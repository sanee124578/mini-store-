// ✅ Imports
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

// ✅ Routes
import authRoutes from "./routes/authRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";

// ✅ Config
dotenv.config();
const app = express();

// 🟢 FINAL CORS (ONLY ONE – NO CONFLICT)
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://mini-store-frontend-qkle7tjqa-sanee-kumars-projects.vercel.app",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

// 🧩 ES Module Path Fix
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Middlewares
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// 🔍 Debug (safe)
console.log("🚀 Server starting...");

// ✅ MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected!"))
  .catch((err) => console.error("❌ MongoDB Error:", err.message));

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/products", productRoutes);
app.use("/api/user", userRoutes);
app.use("/api/orders", orderRoutes);
// 🔍 TEMP DEBUG ROUTE – CHECK WHICH DB BACKEND IS USING
app.get("/which-db", (req, res) => {
  try {
    const dbName = mongoose.connection.db.databaseName;
    res.json({ connectedDatabase: dbName });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🟢 Default Route
app.get("/", (req, res) => {
  res.send("🚀 Mini Store Backend is Live & Running!");
});

// 🔴 Global Error Handler
app.use((err, req, res, next) => {
  console.error("💥 Global Error:", err.stack);
  res.status(500).json({
    success: false,
    message: "Internal Server Error!",
  });
});

// ✅ Start Server
const PORT = process.env.PORT || 10000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);
