import express from "express";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";
import Product from "../models/ProductModel.js";
import { verifyToken, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Cloudinary Storage
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "mini-store-products",
    allowed_formats: ["jpg", "png", "jpeg"],
  },
});
const upload = multer({ storage });


// ✅ Get all products (MAIN ROUTE)
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// Product Search
router.get("/search", async (req, res) => {
  const query = req.query.q;
  if (!query) return res.json([]);

  const products = await Product.find({
    name: { $regex: query, $options: "i" },
  }).limit(10);

  res.json(products);
});


// Add Product (Admin only)
router.post("/add", verifyToken, isAdmin, async (req, res) => {
  try {
    const { name, category, price, stock, image, description } = req.body;

    const newProduct = await Product.create({
      name,
      category,
      price,
      stock,
      image,
      description,
    });

    res.status(201).json({
      message: "Product added successfully",
      product: newProduct,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// Delete Product
router.delete("/:id", verifyToken, isAdmin, async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: "Product deleted" });
});


export default router;
