import express from "express";
import mongoose from "mongoose";
import Cart from "../models/Cart.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

/* 🛒 Get User’s Cart */
router.get("/", verifyToken, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id })
      .populate("products.productId");

    res.status(200).json(cart || { products: [] });
  } catch (error) {
    console.error("❌ Fetch Cart Error:", error.message);
    res.status(500).json({ message: "Error fetching cart", error: error.message });
  }
});

/* ➕ Add Product to Cart (also handles Increment / Decrement) */
router.post("/add", verifyToken, async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    // 🧠 Ensure ObjectId conversion
    const productObjectId = new mongoose.Types.ObjectId(productId);

    // 🔍 Find user's existing cart
    let cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) {
      cart = new Cart({ userId: req.user.id, products: [] });
    }

    // 🔁 Find if product already in cart
    const existingIndex = cart.products.findIndex(
      (p) => p.productId.toString() === productObjectId.toString()
    );

    if (existingIndex > -1) {
      // ✅ Increment or Decrement quantity
      cart.products[existingIndex].quantity += quantity;

      // ❌ If quantity <= 0, remove item
      if (cart.products[existingIndex].quantity <= 0) {
        cart.products.splice(existingIndex, 1);
      }
    } else if (quantity > 0) {
      // ✅ Add new product only if positive quantity
      cart.products.push({ productId: productObjectId, quantity });
    }

    // 💾 Save and populate
    const savedCart = await cart.save();
    const populatedCart = await savedCart.populate("products.productId");

    console.log("✅ Cart Updated Successfully:", req.user.id);
    res.status(200).json(populatedCart);
  } catch (error) {
    console.error("❌ Add to Cart Error:", error.message);
    res.status(500).json({ message: "Error adding to cart", error: error.message });
  }
});

/* ❌ Remove Specific Product */
router.delete("/remove/:id", verifyToken, async (req, res) => {
  try {
    const cart = await Cart.findOneAndUpdate(
      { userId: req.user.id },
      { $pull: { products: { productId: req.params.id } } },
      { new: true }
    ).populate("products.productId");

    console.log("🗑️ Removed product:", req.params.id);
    res.status(200).json(cart);
  } catch (error) {
    console.error("❌ Remove Error:", error.message);
    res.status(500).json({ message: "Error removing item", error: error.message });
  }
});

/* 🧹 Clear Entire Cart */
router.delete("/clear", verifyToken, async (req, res) => {
  try {
    await Cart.findOneAndDelete({ userId: req.user.id });
    console.log("🧹 Cart cleared for user:", req.user.id);
    res.status(200).json({ message: "Cart cleared successfully" });
  } catch (error) {
    console.error("❌ Clear Cart Error:", error.message);
    res.status(500).json({ message: "Error clearing cart", error: error.message });
  }
});

export default router;
