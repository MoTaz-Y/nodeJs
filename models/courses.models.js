const mongoose = require("mongoose");

// Define the schema for a course
const coursesSchema = new mongoose.Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },
});
const courses = mongoose.model("Course", coursesSchema);
console.log(courses.find({}));
// Export the model based on the schema
module.exports = mongoose.model("Course", coursesSchema);
