const mongoose = require("mongoose");
const validator= require("validator")
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
});
module.exports = mongoose.model("User", coursesSchema);
// vbbv?

// models\users.model.js
