const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cart.controller");
const authUser = require("../middlewares/authUser.middleware");
const authorizeRoles = require("../middlewares/authRoles.middleware");
router.post(
  "/addToCart",
  authUser,
  authorizeRoles("admin", "vendor", "customer"),
  cartController.addToCart,
);

router.get(
  "/getCart",
  authUser,
  authorizeRoles("admin", "vendor", "customer"),
  cartController.getCart,
);

router.delete(
  "/deleteFromCart/:productId",
  authUser,
  authorizeRoles("admin", "vendor", "customer"),
  cartController.deleteFromCart,
);

router.delete(
  "/clearCart",
  authUser,
  authorizeRoles("admin", "vendor", "customer"),
  cartController.clearCart,
);
module.exports = router;
