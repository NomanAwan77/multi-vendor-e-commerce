const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order.controller");
const authUser = require("../middlewares/authUser.middleware");
const authorizeRoles = require("../middlewares/authRoles.middleware");
router.post(
  "/create",
  authUser,
  authorizeRoles("admin", "vendor", "customer"),
  orderController.createOrder,
);
router.get(
  "/getOrders",
  authUser,
  authorizeRoles("admin", "vendor", "customer"),
  orderController.getOrders,
);
router.get(
  "/getOrdersByVendor",
  authUser,
  authorizeRoles("vendor"),
  orderController.getOrdersByVendor,
);
module.exports = router;
