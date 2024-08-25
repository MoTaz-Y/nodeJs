const mongoose = require("mongoose");
const validator = require("validator");
const userRole = require("../utils/userRole");
const coursesSchema = new mongoose.Schema({
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
    enum: [userRole.ADMIN, userRole.USER, userRole.GUEST],
    default: userRole.GUEST,
  },
});
module.exports = mongoose.model("User", coursesSchema);
// vbbv?

// models\users.model.js
