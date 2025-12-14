import express from "express";
import bcrypt from "bcryptjs";
import { verifyToken } from "../middleware/authMiddleware.js";
import User from "../models/userModel.js";
import Order from "../models/orderModel.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

/* -------------------------------------------------------------------------- */
/* 👤 USER PROFILE */
/* -------------------------------------------------------------------------- */

// Get profile
router.get("/profile", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update profile
router.put("/profile", verifyToken, async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await User.findById(req.user.id);

    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    if (name) user.name = name;
    if (email) user.email = email;

    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    await user.save();

    const safeUser = user.toObject();
    delete safeUser.password;

    res.json({
      success: true,
      message: "Profile updated successfully",
      user: safeUser,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Upload profile image
router.post(
  "/upload",
  verifyToken,
  upload.single("profile"),
  async (req, res) => {
    try {
      if (!req.file)
        return res
          .status(400)
          .json({ success: false, message: "No file uploaded" });

      const user = await User.findById(req.user.id);
      if (!user)
        return res
          .status(404)
          .json({ success: false, message: "User not found" });

      user.profileImage = req.file.path; // Cloudinary / absolute URL
      await user.save();

      res.json({
        success: true,
        message: "Profile image uploaded successfully",
        imageUrl: req.file.path,
      });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: "Server error uploading image" });
    }
  }
);

/* -------------------------------------------------------------------------- */
/* 📦 USER ORDERS & WISHLIST */
/* -------------------------------------------------------------------------- */

// Get orders
router.get("/orders", verifyToken, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate("items.product", "name price image");

    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get wishlist
router.get("/wishlist", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("wishlist");
    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    res.json({ success: true, wishlist: user.wishlist || [] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/* -------------------------------------------------------------------------- */
/* 🏠 ADDRESS MANAGEMENT */
/* -------------------------------------------------------------------------- */

// Get addresses
router.get("/addresses", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    res.json({ success: true, addresses: user.addresses || [] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Add address
router.post("/addresses", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    user.addresses.push(req.body);
    await user.save();

    res.json({
      success: true,
      message: "Address added successfully",
      addresses: user.addresses,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update address
router.put("/addresses/:id", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    const index = user.addresses.findIndex(
      (a) => a._id.toString() === req.params.id
    );
    if (index === -1)
      return res
        .status(404)
        .json({ success: false, message: "Address not found" });

    user.addresses[index] = {
      ...user.addresses[index]._doc,
      ...req.body,
    };

    await user.save();

    res.json({
      success: true,
      message: "Address updated successfully",
      addresses: user.addresses,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete address
router.delete("/addresses/:id", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    user.addresses = user.addresses.filter(
      (a) => a._id.toString() !== req.params.id
    );

    await user.save();

    res.json({
      success: true,
      message: "Address deleted successfully",
      addresses: user.addresses,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
