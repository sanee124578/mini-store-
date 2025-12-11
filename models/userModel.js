import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    // 👤 Basic User Info
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    // 🧩 Role Management
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
isBlocked: {
  type: Boolean,
  default: false,
},

    // 💖 Wishlist (Linked to Product Model)
    wishlist: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Product" }
    ],

    // 🏠 Addresses Array
    addresses: [
      {
        name: { type: String },
        phone: { type: String },
        address: { type: String },
        city: { type: String },
        state: { type: String },
        pincode: { type: String },
      },
    ],

    // 📸 Profile Image
    profileImage: { type: String, default: "" },
  },
  { timestamps: true }
);

// 🔒 Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// 🔑 Compare entered vs hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model("User", userSchema);
