const express = require("express");
const router = express.Router();
const productController = require("../controllers/product.controller");
const authUser = require("../middlewares/authUser.middleware");
const authorizeRoles = require("../middlewares/authRoles.middleware");
const multer = require("multer");
const upload = multer({
  storage: multer.memoryStorage(),
});
router.post(
  "/createProduct",
  authUser,
  authorizeRoles("vendor"),
  upload.single("image"),
  productController.createProduct,
);
router.get(
  "/getAllProducts",
  authUser,
  authorizeRoles("admin", "vendor", "customer"),
  productController.getAllProducts,
);
router.put(
  "/updateProduct/:id",
  authUser,
  authorizeRoles("vendor"),
  upload.single("image"),
  productController.updateProduct,
);
router.delete(
  "/deleteProduct/:id",
  authUser,
  authorizeRoles("vendor"),
  productController.deleteProduct,
);
router.get(
  "/getProductById/:id",
  authUser,
  authorizeRoles("admin", "vendor", "customer"),
  productController.getProductById,
);

module.exports = router;
