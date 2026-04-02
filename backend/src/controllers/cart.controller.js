const CartModel = require("../models/cart.model");

const addToCart = async (req, res) => {
  const { productId, quantity = 1 } = req.body;
  try {
    let cart = await CartModel.findOne({ userId: req.user.id });
    if (!cart) {
      cart = await CartModel.create({
        userId: req.user.id,
        products: [{ productId, quantity }],
      });
    } else {
      const isProductExist = cart.products.find(
        (product) => product.productId.toString() === productId.toString(),
      );
      if (isProductExist) {
        isProductExist.quantity += quantity;
        await cart.save();
      } else {
        cart.products.push({ productId, quantity });
        await cart.save();
      }
    }
    res
      .status(200)
      .json({ message: "Product added to cart successfully", cart });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
const getCart = async (req, res) => {
  try {
    const cart = await CartModel.findOne({ userId: req.user.id }).populate(
      "products.productId",
    );
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    res.status(200).json({ message: "Cart fetched successfully", cart });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
const deleteFromCart = async (req, res) => {
  const { productId } = req.params;
  try {
    const cart = await CartModel.findOne({ userId: req.user.id });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    const isProductExist = cart.products.find(
      (product) => product.productId.toString() === productId.toString(),
    );
    if (!isProductExist) {
      return res.status(404).json({ message: "Product not found in cart" });
    }
    if (isProductExist.quantity > 1) {
      isProductExist.quantity -= 1;
    } else {
      cart.products = cart.products.filter(
        (product) => product.productId.toString() !== productId.toString(),
      );
    }
    await cart.save();
    res
      .status(200)
      .json({ message: "Product deleted from cart successfully", cart });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
const clearCart = async (req, res) => {
  try {
    const cart = await CartModel.findOne({ userId: req.user.id });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    cart.products = [];
    await cart.save();
    res.status(200).json({ message: "Cart cleared successfully", cart });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
module.exports = { addToCart, getCart, deleteFromCart, clearCart };
