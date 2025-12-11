import express from "express";
import Order from "../models/orderModel.js";
import { verifyToken, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

/* -------------------------------------------------------------------------- */
/* 🧾 ADMIN: Get All Orders */
/* -------------------------------------------------------------------------- */
router.get("/all", verifyToken, isAdmin, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("items.product", "name price")
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, orders });
  } catch (err) {
    console.error("❌ Error fetching all orders:", err.message);
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

    res.status(200).json({ success: true, orders });
  } catch (err) {
    console.error("❌ Error fetching user orders:", err.message);
    res.status(500).json({
      success: false,
      message: "Server error while fetching orders",
    });
  }
});

/* -------------------------------------------------------------------------- */
/* 🛒 USER: Create New Order (with shipping address) */
/* -------------------------------------------------------------------------- */
router.post("/create", verifyToken, async (req, res) => {
  try {
    const { items, totalAmount, shippingAddress } = req.body;

    // ✅ Validate
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

    // ✅ Create new order
    const newOrder = new Order({
      user: req.user.id,
      items,
      totalAmount,
      shippingAddress, // ✅ Correct field
    });

    await newOrder.save();

    res.status(201).json({
      success: true,
      message: "✅ Order placed successfully!",
      order: newOrder,
    });
  } catch (err) {
    console.error("❌ Error creating order:", err);
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

    if (!["Pending", "Processing", "Delivered", "Cancelled"].includes(status)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid order status" });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updatedOrder)
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });

    res.status(200).json({
      success: true,
      message: "✅ Order status updated successfully",
      order: updatedOrder,
    });
  } catch (err) {
    console.error("❌ Error updating order:", err.message);
    res.status(500).json({
      success: false,
      message: "Server error while updating order",
    });
  }
});

/* -------------------------------------------------------------------------- */
/* ❌ ADMIN: Delete an Order */
/* -------------------------------------------------------------------------- */
router.delete("/delete/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    const deletedOrder = await Order.findByIdAndDelete(req.params.id);

    if (!deletedOrder)
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });

    res.status(200).json({
      success: true,
      message: "🗑️ Order deleted successfully",
    });
  } catch (err) {
    console.error("❌ Error deleting order:", err.message);
    res.status(500).json({
      success: false,
      message: "Server error while deleting order",
    });
  }
});

/* -------------------------------------------------------------------------- */
/* 🛑 USER: Cancel My Order (with reason) */
/* -------------------------------------------------------------------------- */
router.put("/cancel/:id", verifyToken, async (req, res) => {
  try {
    const orderId = req.params.id;
    const { reason } = req.body;

    const order = await Order.findOne({ _id: orderId, user: req.user.id });
    if (!order)
      return res.status(404).json({
        success: false,
        message: "Order not found or unauthorized",
      });

    if (order.status === "Delivered") {
      return res.status(400).json({
        success: false,
        message: "Delivered orders cannot be cancelled",
      });
    }

    order.status = "Cancelled";
    order.cancelReason = reason || "No reason provided";
    order.cancelledAt = new Date();

    await order.save();

    res.status(200).json({
      success: true,
      message: "❌ Order cancelled successfully!",
      order,
    });
  } catch (err) {
    console.error("❌ Error cancelling order:", err.message);
    res.status(500).json({
      success: false,
      message: "Server error while cancelling order",
    });
  }
});

/* -------------------------------------------------------------------------- */
/* ✅ Admin Shortcut Route */
/* -------------------------------------------------------------------------- */
router.get("/", verifyToken, isAdmin, async (req, res) => {
  try {
    const orders = await Order.find().populate("user", "name email");
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
