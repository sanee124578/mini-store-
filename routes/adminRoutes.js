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
      return res
        .status(404)
        .json({ success: false, message: "Admin not found" });

    res.json({
      success: true,
      admin,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error fetching admin",
    });
  }
});

/* -------------------------------------------------------------------------- */
/* 👥 ADMIN: Get All Users (Paginated) */
/* -------------------------------------------------------------------------- */
router.get("/users", verifyToken, isAdmin, async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const users = await User.find()
      .select("-password")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalUsers = await User.countDocuments();

    res.json({
      success: true,
      users,
      pagination: {
        page,
        totalPages: Math.ceil(totalUsers / limit),
        totalUsers,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error fetching users",
    });
  }
});

/* -------------------------------------------------------------------------- */
/* 🚫 ADMIN: Block / Unblock User */
/* -------------------------------------------------------------------------- */
router.put("/block/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    // ❌ Prevent admin from blocking himself
    if (req.params.id === req.user.id) {
      return res.status(400).json({
        success: false,
        message: "Admin cannot block himself",
      });
    }

    const user = await User.findById(req.params.id);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

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
    res.status(500).json({
      success: false,
      message: "Server error toggling user block",
    });
  }
});

export default router;
