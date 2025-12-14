import express from "express";
import Order from "../models/orderModel.js";
import Product from "../models/ProductModel.js";
import { verifyToken, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

/* -------------------------------------------------------------------------- */
/* 🧾 ADMIN: Get All Orders */
/* -------------------------------------------------------------------------- */
router.get("/all", verifyToken, isAdmin, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("items.product", "name price image")
      .sort({ createdAt: -1 });

    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error while fetching orders",
    });
  }
});

/* -------------------------------------------------------------------------- */
/* 👤 USER: Get My Orders */
/* -------------------------------------------------------------------------- */
router.get("/my-orders", verifyToken, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate("items.product", "name price image")
      .sort({ createdAt: -1 });

    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error while fetching orders",
    });
  }
});

/* -------------------------------------------------------------------------- */
/* 🛒 USER: Create New Order (SECURE) */
/* -------------------------------------------------------------------------- */
router.post("/create", verifyToken, async (req, res) => {
  try {
    const { items, shippingAddress } = req.body;

    if (!items || items.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Cart items are required" });
    }

    if (!shippingAddress) {
      return res
        .status(400)
        .json({ success: false, message: "Shipping address is required" });
    }

    // 🔐 Calculate totalAmount on server
    let totalAmount = 0;

    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product)
        return res
          .status(404)
          .json({ success: false, message: "Product not found" });

      totalAmount += product.price * item.quantity;
    }

    const order = await Order.create({
      user: req.user.id,
      items,
      totalAmount,
      shippingAddress,
      status: "Pending",
    });

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error while creating order",
    });
  }
});

/* -------------------------------------------------------------------------- */
/* 🟢 ADMIN: Update Order Status */
/* -------------------------------------------------------------------------- */
router.put("/update/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatus = ["Pending", "Processing", "Delivered", "Cancelled"];
    if (!allowedStatus.includes(status)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid order status" });
    }

    const order = await Order.findById(req.params.id);
    if (!order)
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });

    order.status = status;
    await order.save();

    res.json({
      success: true,
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error while updating order",
    });
  }
});

/* -------------------------------------------------------------------------- */
/* ❌ ADMIN: Delete Order */
/* -------------------------------------------------------------------------- */
router.delete("/delete/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    const deleted = await Order.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });

    res.json({
      success: true,
      message: "Order deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error while deleting order",
    });
  }
});

/* -------------------------------------------------------------------------- */
/* 🛑 USER: Cancel My Order */
/* -------------------------------------------------------------------------- */
router.put("/cancel/:id", verifyToken, async (req, res) => {
  try {
    const { reason } = req.body;

    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!order)
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });

    if (order.status !== "Pending") {
      return res.status(400).json({
        success: false,
        message: "Only pending orders can be cancelled",
      });
    }

    order.status = "Cancelled";
    order.cancelReason = reason || "No reason provided";
    order.cancelledAt = new Date();

    await order.save();

    res.json({
      success: true,
      message: "Order cancelled successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error while cancelling order",
    });
  }
});

export default router;
