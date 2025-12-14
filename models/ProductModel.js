import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    discount: {
      type: Number,
      default: 0, // percentage
      min: 0,
      max: 90,
    },

    sellingPrice: {
      type: Number,
      min: 0,
    },

    stock: {
      type: Number,
      default: 1,
      min: 0,
    },

    image: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  { timestamps: true }
);

/* 🔄 Auto calculate selling price */
productSchema.pre("save", function (next) {
  if (this.discount > 0) {
    this.sellingPrice = Math.round(
      this.price - (this.price * this.discount) / 100
    );
  } else {
    this.sellingPrice = this.price;
  }
  next();
});

// 👇 Exact collection name
export default mongoose.model("Product", productSchema, "products");
