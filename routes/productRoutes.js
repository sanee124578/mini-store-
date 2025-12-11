import express from "express";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";
import Product from "../models/ProductModel.js";
import { verifyToken, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Multer storage setup
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "mini-store-products",
    allowed_formats: ["jpg", "png", "jpeg"],
  },
});
const upload = multer({ storage });

// ✅ Fetch all products
router.get("/", async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

// ✅ Add new product with image upload
router.post("/", verifyToken, isAdmin, upload.single("image"), async (req, res) => {
  try {
    const newProduct = new Product({
      name: req.body.name,
      category: req.body.category,
      price: req.body.price,
      stock: req.body.stock,
      description: req.body.description,
      image: req.file.path,
    });
    await newProduct.save();
    res.json({ message: "✅ Product added successfully", product: newProduct });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ Update product
router.put("/:id", verifyToken, isAdmin, async (req, res) => {
  const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json({ message: "Product updated!", product: updated });
});
   // ✅ Get all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// 📁 routes/productRoutes.js
router.get("/search", async (req, res) => {
  const query = req.query.q;
  if (!query) return res.json([]);
  const products = await Product.find({
    name: { $regex: query, $options: "i" },
  }).limit(10);
  res.json(products);
});

// ✅ Add new product (Admin only)
router.post("/add", verifyToken, isAdmin, async (req, res) => {
  try {
    const { name, category, price, stock, image, description } = req.body;

    if (!name || !category || !price || !image) {
      return res.status(400).json({ message: "All required fields must be filled" });
    }

    const newProduct = await Product.create({
      name,
      category,
      price,
      stock,
      image,
      description,
    });

    res.status(201).json({
      message: "✅ Product added successfully",
      product: newProduct,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// ✅ Delete product
router.delete("/:id", verifyToken, isAdmin, async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: "🗑️ Product deleted successfully" });
});

export default router;
