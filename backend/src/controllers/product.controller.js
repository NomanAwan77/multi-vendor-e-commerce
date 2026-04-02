const uploadImage = require("../services/storage.service");
const ProductModel = require("../models/product.model");
const createProduct = async (req, res) => {
  const { name, description, price, stock, category } = req.body;

  const image = req?.file?.buffer?.toString("base64");
  const imageUrl = image ? await uploadImage.uploadImage(image) : null;
  console.log("imageUrl", imageUrl);
  console.log("name", name);
  console.log("description", description);
  console.log("price", price);
  console.log("stock", stock);
  console.log("category", category);
  try {
    const product = await ProductModel.create({
      name,
      description,
      price: Number(price),
      stock: Number(stock),
      vendorId: req.user.id,
      category,
      imageUrl: imageUrl?.url,
    });
    res.status(201).json({ message: "Product created successfully", product });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const products = await ProductModel.find().populate(
      "vendorId",
      "name email storeName storeDescription",
    );
    res
      .status(200)
      .json({ message: "Products fetched successfully", products });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, description, price, stock, category } = req.body;
  try {
    const product = await ProductModel.findById(id);
    console.log("product on top", product);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    console.log("product?.vendorId?.toString()", product?.vendorId?.toString());
    console.log("req?.user?.id?.toString()", req?.user?.id?.toString());
    if (product?.vendorId?.toString() !== req?.user?.id?.toString()) {
      return res.status(403).json({
        message: "Forbidden - Not your product",
      });
    }
    console.log("product", product);
    let imageUrl = product.imageUrl;

    if (req.file) {
      const image = req.file.buffer.toString("base64");
      const uploadedImage = await uploadImage.uploadImage(image);
      imageUrl = uploadedImage.url;
    }
    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price ? Number(price) : product.price;
    product.stock = stock ? Number(stock) : product.stock;
    product.category = category || product.category;
    product.imageUrl = imageUrl || product.imageUrl;
    const updatedProduct = await product.save();

    res.status(200).json({
      message: "Product updated successfully",

      product: updatedProduct,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
const deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await ProductModel.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    if (product?.vendorId?.toString() !== req?.user?.id?.toString()) {
      return res.status(403).json({
        message: "Forbidden - Not your product",
      });
    }
    await product.deleteOne();
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
const getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await ProductModel.findById(id).populate(
      "vendorId",
      "name email storeName storeDescription",
    );
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ message: "Product fetched successfully", product });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
  getProductById,
};
