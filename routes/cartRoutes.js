import express from "express";
import mongoose from "mongoose";
import Cart from "../models/Cart.js";
import Product from "../models/ProductModel.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

/* -------------------------------------------------------------------------- */
/* 🛒 Get User Cart */
/* -------------------------------------------------------------------------- */
router.get("/", verifyToken, async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.user.id })
      .populate("products.productId");

    if (!cart) {
      cart = await Cart.create({ userId: req.user.id, products: [] });
    }

    res.json({ success: true, cart });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching cart",
    });
  }
});

/* -------------------------------------------------------------------------- */
/* ➕ Add / Update Cart Item */
/* -------------------------------------------------------------------------- */
router.post("/add", verifyToken, async (req, res) => {
  try {
    let { productId, quantity = 1 } = req.body;

    if (!productId)
      return res
        .status(400)
        .json({ success: false, message: "Product ID is required" });

    // quantity control
    quantity = Number(quantity);
    if (isNaN(quantity) || quantity < -5 || quantity > 10) {
      return res.status(400).json({
        success: false,
        message: "Invalid quantity value",
      });
    }

    // product existence
    const product = await Product.findById(productId);
    if (!product)
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });

    let cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) cart = new Cart({ userId: req.user.id, products: [] });

    const productObjectId = new mongoose.Types.ObjectId(productId);

    const index = cart.products.findIndex(
      (p) => p.productId.toString() === productObjectId.toString()
    );

    if (index > -1) {
      cart.products[index].quantity += quantity;

      if (cart.products[index].quantity <= 0) {
        cart.products.splice(index, 1);
      }
    } else if (quantity > 0) {
      cart.products.push({ productId: productObjectId, quantity });
    }

    await cart.save();
    await cart.populate("products.productId");

    res.json({ success: true, cart });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating cart",
    });
  }
});

/* -------------------------------------------------------------------------- */
/* ❌ Remove Item from Cart */
/* -------------------------------------------------------------------------- */
router.delete("/remove/:id", verifyToken, async (req, res) => {
  try {
    const productObjectId = new mongoose.Types.ObjectId(req.params.id);

    const cart = await Cart.findOneAndUpdate(
      { userId: req.user.id },
      { $pull: { products: { productId: productObjectId } } },
      { new: true }
    ).populate("products.productId");

    res.json({ success: true, cart });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error removing item from cart",
    });
  }
});

/* -------------------------------------------------------------------------- */
/* 🧹 Clear Cart */
/* -------------------------------------------------------------------------- */
router.delete("/clear", verifyToken, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id });
    if (!cart)
      return res.json({ success: true, cart: { products: [] } });

    cart.products = [];
    await cart.save();

    res.json({ success: true, message: "Cart cleared", cart });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error clearing cart",
    });
  }
});

export default router;
