import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    // 👤 User who placed the order
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // 🛍️ Array of ordered items
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        name: { type: String, required: true },   // ✅ Product name
        price: { type: Number, required: true },  // ✅ Product price at time of order
        image: { type: String },                  // ✅ Product image (optional)
        quantity: { type: Number, default: 1 },   // ✅ Product quantity
      },
    ],

    // 💰 Total order amount
    totalAmount: {
      type: Number,
      required: true,
    },

    // 🏠 Shipping Address (from user at checkout)
    shippingAddress: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true },
    },

    // 🚚 Order status
    status: {
      type: String,
      enum: ["Pending", "Processing", "Delivered", "Cancelled"],
      default: "Pending",
    },

    // ❌ If user cancels order
    cancelReason: { type: String, default: null },
    cancelledAt: { type: Date, default: null },

    // 💳 Payment Info (optional for now)
    paymentInfo: {
      method: { type: String, default: "COD" }, // COD, Razorpay, etc.
      transactionId: { type: String },
    },
  },
  { timestamps: true } // ✅ adds createdAt & updatedAt
);

export default mongoose.model("Order", orderSchema);
