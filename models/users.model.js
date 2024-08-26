const mongoose = require("mongoose");
const validator = require("validator");
const userRole = require("../utils/userRole");
const usersSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: [validator.isEmail, "invalid email address"], //custom validation validatorjs
  },
  password: { type: String, required: true },
  token: { type: String },
  role: {
    type: String,
    enum: [userRole.ADMIN, userRole.USER, userRole.GUEST, userRole.MANAGER],
    default: userRole.GUEST,
  },
  avatar: { type: String, default: "public/profile.webp" },
});
module.exports = mongoose.model("User", usersSchema);
// vbbv?

// models\users.model.js
