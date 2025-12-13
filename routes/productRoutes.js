import express from "express";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";
import Product from "../models/ProductModel.js";
import { verifyToken, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// ----------------------
// CLOUDINARY STORAGE
// ----------------------
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "mini-store-products",
    allowed_formats: ["jpg", "png", "jpeg"],
  },
});
const upload = multer({ storage });

// ----------------------
// GET ALL PRODUCTS
// ----------------------
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    return res.json(products);
  } catch (error) {
    console.error("Product Fetch Error:", error);
    return res.status(500).json({ message: "Error fetching products" });
  }
});

// ----------------------
// SEARCH PRODUCTS
// ----------------------
router.get("/search", async (req, res) => {
  const query = req.query.q;
  if (!query) return res.json([]);

  const products = await Product.find({
    name: { $regex: query, $options: "i" },
  }).limit(10);

  res.json(products);
});

// ----------------------
// ADD PRODUCT (Image upload)
// ----------------------
router.post("/", verifyToken, isAdmin, upload.single("image"), async (req, res) => {
  try {
    const newProduct = new Product({
      name: req.body.name,
      category: req.body.category,
      price: req.body.price,
      stock: req.body.stock,
      description: req.body.description,
      image: req.file?.path || req.body.image,
    });

    await newProduct.save();

    res.json({ message: "Product added successfully", product: newProduct });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ----------------------
// DELETE PRODUCT
// ----------------------
router.delete("/:id", verifyToken, isAdmin, async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: "Product deleted successfully" });
});

// ----------------------
// UPDATE PRODUCT
// ----------------------
router.put("/:id", verifyToken, isAdmin, async (req, res) => {
  const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json({ message: "Product updated!", product: updated });
});

export default router;
