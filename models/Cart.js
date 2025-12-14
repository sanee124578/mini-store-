import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // 🛑 One cart per user
    },
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        name: {
          type: String, // snapshot
          required: true,
        },
        price: {
          type: Number, // snapshot price
          required: true,
        },
        image: {
          type: String,
        },
        quantity: {
          type: Number,
          min: 1,
          max: 10,
          default: 1,
        },
      },
    ],
    totalItems: {
      type: Number,
      default: 0,
    },
    totalPrice: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

/* 🔄 Auto calculate totals */
cartSchema.pre("save", function (next) {
  this.totalItems = this.products.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  this.totalPrice = this.products.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  );

  next();
});

const Cart = mongoose.model("Cart", cartSchema);
export default Cart;
