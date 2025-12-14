import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // ❌ No token OR wrong format
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, role }
    next();
  } catch (error) {
    // 🔥 IMPORTANT: invalid / expired token = 401
    return res.status(401).json({ message: "Token expired or invalid" });
  }
};

export const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (user && user.role === "admin") {
      next();
    } else {
      return res
        .status(403)
        .json({ message: "Access denied. Admins only." });
    }
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};
