import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import { verifyToken, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// 🔹 Generate JWT Token
const generateToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

// ✅ Register (for new user)
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, confirmPassword, role } = req.body;

    // Validation
    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // ❌ Don’t hash here — userModel.js already hashes password
    const user = await User.create({
      name,
      email,
      password, // plain text → model will hash automatically
      role: role || "user",
    });

    res.status(201).json({
      message: "✅ Registered Successfully!",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token: generateToken(user),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ✅ Admin Create User/Admin
router.post("/admin/register", verifyToken, isAdmin, async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "All fields required" });
    }

    if (!["admin", "user"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // ❌ Don’t hash here too
    const newUser = await User.create({
      name,
      email,
      password, // plain password → schema will hash
      role,
    });

    res.status(201).json({
      message: `✅ ${role.toUpperCase()} created successfully`,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ✅ Login (both user & admin)
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // 🔐 Compare hashed password using method in model
    const isMatch = await user.matchPassword(password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });
      // ✅ ADD THIS CHECK 👇
    if (user.isBlocked) {
      return res.status(403).json({
        message: "Your account has been blocked. Please contact admin support.",
      });
    }
    res.json({
      message: "✅ Login Successful!",
      token: generateToken(user),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ✅ Verify Token Route (for ProtectedRoute.jsx)
router.get("/verify", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// ✅ Get all users (Admin only)
router.get("/all", verifyToken, isAdmin, async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (err) {
    console.error("❌ Error fetching users:", err.message);
    res.status(500).json({ message: "Server error while fetching users" });
  }
});

export default router;
