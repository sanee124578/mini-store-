import express from "express";
import { verifyToken, isAdmin } from "../middleware/authMiddleware.js";
import User from "../models/userModel.js";

const router = express.Router();

/* -------------------------------------------------------------------------- */
/* 🧠 ADMIN: Get Admin Info */
/* -------------------------------------------------------------------------- */
router.get("/", verifyToken, isAdmin, async (req, res) => {
  try {
    const admin = await User.findById(req.user.id).select("-password");
    if (!admin)
      return res.status(404).json({ success: false, message: "Admin not found" });

    res.json({
      success: true,
      message: `Welcome Admin ${admin.name}`,
      admin,
    });
  } catch (err) {
    console.error("❌ Error fetching admin:", err.message);
    res.status(500).json({ success: false, message: "Server error fetching admin" });
  }
});

/* -------------------------------------------------------------------------- */
/* 👥 ADMIN: Get All Users */
/* -------------------------------------------------------------------------- */
router.get("/users", verifyToken, isAdmin, async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json({ success: true, users });
  } catch (err) {
    console.error("❌ Error fetching users:", err.message);
    res.status(500).json({ success: false, message: "Server error fetching users" });
  }
});

/* -------------------------------------------------------------------------- */
/* 🚫 ADMIN: Toggle Block / Unblock User */
/* -------------------------------------------------------------------------- */
router.put("/block/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    user.isBlocked = !user.isBlocked;
    await user.save();

    res.json({
      success: true,
      message: `User ${user.isBlocked ? "blocked" : "unblocked"} successfully`,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isBlocked: user.isBlocked,
      },
    });
  } catch (error) {
    console.error("❌ Error blocking/unblocking user:", error.message);
    res.status(500).json({ success: false, message: "Server error toggling user block" });
  }
});

export default router;
