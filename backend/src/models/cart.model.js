const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
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
      quantity: {
        type: Number,
        required: true,
      },
    },
  ],
});

const CartModel = mongoose.model("CartModel", cartSchema);

module.exports = CartModel;
