const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },

  role: {
    type: String,
    enum: ["admin", "vendor", "customer"],
    default: "customer",
  },
  storeName: {
    type: String,
  },

  storeDescription: {
    type: String,
  },
});

const UserModel = mongoose.model("UserModel", userSchema);

module.exports = UserModel;
