const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserModel",
      required: true,
    },

    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "ProductModel",
          required: true,
        },
        quantity: Number,
      },
    ],

    shippingAddress: {
      address: String,
      city: String,
      state: String,
      country: String,
      postalCode: String,
    },

    paymentMethod: {
      type: String,
      enum: ["COD", "CARD", "ONLINE"],
      default: "COD",
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },

    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "shipped",
        "delivered",
        "cancelled",
        "returned",
      ],
      default: "pending",
    },

    subTotal: Number,
    shippingFee: Number,
    tax: Number,
    totalAmount: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true },
);

const OrderModel = mongoose.model("OrderModel", orderSchema);
module.exports = OrderModel;
