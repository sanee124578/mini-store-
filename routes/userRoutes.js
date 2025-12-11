import express from "express";
import bcrypt from "bcryptjs";
import { verifyToken } from "../middleware/authMiddleware.js";
import User from "../models/userModel.js";
import Order from "../models/orderModel.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

/* -------------------------------------------------------------------------- */
/* 🧠 USER PROFILE ROUTES */
/* -------------------------------------------------------------------------- */

// ✅ Get logged-in user profile
router.get("/profile", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ✅ Update user profile
router.put("/profile", verifyToken, async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    user.name = name || user.name;
    user.email = email || user.email;

    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    await user.save();
    res.json({ success: true, message: "Profile updated successfully", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 📸 Upload profile image
// 📸 Profile Image Upload Route
router.post("/upload", verifyToken, upload.single("profile"), async (req, res) => {
  try {
    if (!req.file)
      return res.status(400).json({ message: "No file uploaded!" });

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Store relative path or absolute URL
    const imagePath = `/uploads/${req.file.filename}`;
    user.profileImage = imagePath;
    await user.save();

    res.json({
      success: true,
      message: "Profile image uploaded successfully!",
      imageUrl: imagePath,
    });
  } catch (error) {
    console.error("❌ Upload error:", error);
    res.status(500).json({ message: "Server error uploading image" });
  }
});

/* -------------------------------------------------------------------------- */
/* 🧾 USER ORDERS + WISHLIST */
/* -------------------------------------------------------------------------- */

// ✅ Get user's orders
router.get("/orders", verifyToken, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).populate("items.product", "name price image");
    res.json({ success: true, orders });
  } catch (error) {
    console.error("❌ Error fetching orders:", error);
    res.status(500).json({ message: error.message });
  }
});

// ✅ Get user's wishlist
router.get("/wishlist", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("wishlist");
    res.json({ success: true, wishlist: user.wishlist });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* -------------------------------------------------------------------------- */
/* 🏠 USER ADDRESS MANAGEMENT (ADD / UPDATE / DELETE) */
/* -------------------------------------------------------------------------- */

// ✅ Get all addresses of logged-in user
router.get("/addresses", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({ success: true, addresses: user.addresses || [] });
  } catch (error) {
    console.error("Error fetching addresses:", error);
    res.status(500).json({ message: error.message });
  }
});

// ✅ Add new address
router.post("/addresses", verifyToken, async (req, res) => {
  try {
    const { name, phone, address, city, state, pincode } = req.body;
    const user = await User.findById(req.user.id);

    const newAddress = { name, phone, address, city, state, pincode };
    user.addresses.push(newAddress);
    await user.save();

    res.json({ success: true, message: "Address added successfully", addresses: user.addresses });
  } catch (error) {
    console.error("Error adding address:", error);
    res.status(500).json({ message: error.message });
  }
});

// ✅ Update address
router.put("/addresses/:id", verifyToken, async (req, res) => {
  try {
    const { name, phone, address, city, state, pincode } = req.body;
    const user = await User.findById(req.user.id);

    const index = user.addresses.findIndex((a) => a._id.toString() === req.params.id);
    if (index === -1) return res.status(404).json({ message: "Address not found" });

    user.addresses[index] = {
      ...user.addresses[index]._doc,
      name,
      phone,
      address,
      city,
      state,
      pincode,
    };

    await user.save();
    res.json({ success: true, message: "Address updated successfully", addresses: user.addresses });
  } catch (error) {
    console.error("Error updating address:", error);
    res.status(500).json({ message: error.message });
  }
});

// ✅ Delete address
router.delete("/addresses/:id", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.addresses = user.addresses.filter((a) => a._id.toString() !== req.params.id);
    await user.save();

    res.json({ success: true, message: "Address deleted successfully", addresses: user.addresses });
  } catch (error) {
    console.error("Error deleting address:", error);
    res.status(500).json({ message: error.message });
  }
});

export default router;
