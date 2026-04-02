const UserModel = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const registerUser = async (req, res) => {
  console.log(req.body);
  const {
    name,
    email,
    password,
    role = "customer",
    storeName,
    storeDescription,
  } = req.body;
  try {
    const isEmailExist = await UserModel.findOne({ email });
    if (isEmailExist) {
      return res.status(400).json({ message: "Email already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const userRole =
      role === "admin" ? "admin" : role === "vendor" ? "vendor" : "customer";
    let vendorData = {};
    if (userRole === "vendor") {
      if (!storeName) {
        return res.status(400).json({
          message: "Store name is required for vendor",
        });
      }

      vendorData = {
        storeName,
        storeDescription,
      };
    }

    const newUser = await UserModel.create({
      name,
      email,
      password: hashedPassword,
      role,
      ...vendorData,
    });
    const token = jwt.sign(
      { id: newUser._id, role: newUser.role },
      process.env.JWT_SECRET,
    );
    res.cookie("token", token);
    res.status(201).json({
      message: "User created successfully",
      user: {
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        ...vendorData,
      },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);
  try {
    const user = await UserModel.findOne({ email }).select("+password");
    console.log(user);
    if (!user) {
      return res.status(400).json({ message: "Invalid email" });
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    console.log("isPasswordCorrect", isPasswordCorrect);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid password" });
    }
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
    );
    res.cookie("token", token);
    res.status(200).json({
      message: "Login successful",
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

const logoutUser = async (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logout successful" });
};
const getAllUsers = async (req, res) => {
  try {
    const users = await UserModel.find();
    res.status(200).json({
      message: "Users fetched successfully",
      users,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
module.exports = { registerUser, loginUser, logoutUser, getAllUsers };
