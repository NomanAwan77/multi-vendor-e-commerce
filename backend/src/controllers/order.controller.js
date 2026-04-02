const CartModel = require("../models/cart.model");
const OrderModel = require("../models/order.model");
const createOrder = async (req, res) => {
  try {
    const { shippingAddress, paymentMethod } = req.body;

    const cart = await CartModel.findOne({ userId: req.user.id }).populate(
      "products.productId",
    );
    if (!cart || cart.products.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }
    let subTotal = 0;

    const orderProducts = cart.products.map((product) => {
      const price = product.productId.price;
      subTotal += price * product.quantity;
      return {
        productId: product.productId._id,
        quantity: product.quantity,
        price,
      };
    });
    const shippingFee = 100;
    const tax = subTotal * 0.1;
    const totalAmount = subTotal + shippingFee + tax;
    const order = await OrderModel.create({
      userId: req.user.id,
      products: orderProducts,
      shippingAddress,
      paymentMethod,
      subTotal,
      shippingFee,
      tax,
      totalAmount,
    });
    cart.products = [];
    await cart.save();
    res.status(201).json({ message: "Order created successfully", order });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
const getOrders = async (req, res) => {
  try {
    const orders = await OrderModel.find({ userId: req.user.id }).populate(
      "products.productId",
      "name price quantity imageUrl",
    );
    res.status(200).json({ message: "Orders fetched successfully", orders });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

const getOrdersByVendor = async (req, res) => {
  try {
    const orders = await OrderModel.find().populate({
      path: "products.productId",
      populate: {
        path: "vendorId",
      },
    });
    const vendorOrders = orders
      .map((order) => {
        const filteredProducts = order.products.filter(
          (item) => item.productId?.vendorId?._id?.toString() === req.user.id,
        );

        if (filteredProducts.length === 0) return null;

        return {
          ...order.toObject(),
          products: filteredProducts,
        };
      })
      .filter(Boolean);
    res.status(200).json({
      message: "Orders fetched successfully",
      vendorOrders,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
module.exports = { createOrder, getOrders, getOrdersByVendor };
