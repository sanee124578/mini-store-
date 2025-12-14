import express from "express";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";
import Product from "../models/ProductModel.js";
import { verifyToken, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "mini-store-products",
    allowed_formats: ["jpg", "png", "jpeg"],
  },
});
const upload = multer({ storage });

// Get all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json({ success: true, products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Search
router.get("/search", async (req, res) => {
  const query = req.query.q;
  if (!query) return res.json({ success: true, products: [] });

  const products = await Product.find({
    name: { $regex: query, $options: "i" },
  }).limit(10);

  res.json({ success: true, products });
});

// Add product (Admin)
router.post(
  "/add",
  verifyToken,
  isAdmin,
  upload.single("image"),
  async (req, res) => {
    try {
      const { name, category, price, stock, description } = req.body;

      const product = await Product.create({
        name,
        category,
        price,
        stock,
        description,
        image: req.file?.path,
      });

      res.status(201).json({ success: true, product });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
);

// Delete product
router.delete("/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res.status(404).json({ message: "Product not found" });

    res.json({ success: true, message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
