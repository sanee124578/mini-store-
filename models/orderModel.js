import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    /* 👤 User */
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    /* 🛍️ Ordered Items (Snapshot) */
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        image: { type: String },
        quantity: {
          type: Number,
          required: true,
          min: 1,
          max: 10,
        },
      },
    ],

    /* 💰 Totals */
    totalItems: {
      type: Number,
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },

    /* 🏠 Shipping Address */
    shippingAddress: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true },
    },

    /* 🚚 Order Status */
    status: {
      type: String,
      enum: ["Pending", "Processing", "Delivered", "Cancelled"],
      default: "Pending",
      index: true,
    },

    /* ❌ Cancellation */
    cancelReason: { type: String, default: null },
    cancelledAt: { type: Date, default: null },

    /* 💳 Payment */
    paymentInfo: {
      method: {
        type: String,
        enum: ["COD", "Razorpay", "Stripe"],
        default: "COD",
      },
      transactionId: { type: String },
      paymentStatus: {
        type: String,
        enum: ["Pending", "Paid", "Failed"],
        default: "Pending",
      },
      paidAt: { type: Date },
    },

    /* ⏱️ Lifecycle Dates */
    deliveredAt: { type: Date },
  },
  { timestamps: true }
);

/* 🔒 Auto calculate totals (safety) */
orderSchema.pre("validate", function (next) {
  this.totalItems = this.items.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  this.totalAmount = this.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  next();
});

export default mongoose.model("Order", orderSchema);
