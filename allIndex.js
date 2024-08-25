const express = require("express");
const mongoose = require("mongoose");
const { body, validationResult } = require("express-validator");

// Initialize Express app
const app = express();
app.use(express.json());

// MongoDB connection
const url =
  "mongodb+srv://motaz-mongo:motaz@@77@learn-mongo-db.xujqy6w.mongodb.net/learn-mongo-db?retryWrites=true&w=majority";
mongoose
  .connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error", err));

// Define Mongoose schema and model
const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },
});

const Course = mongoose.model("Course", courseSchema);

// Middleware for validation
const validationSchema = () => {
  return [
    body("title").notEmpty().withMessage("Title should not be empty"),
    body("price")
      .notEmpty()
      .isFloat({ min: 100 })
      .withMessage("Price should not be empty and must be at least 100"),
  ];
};

// Routes
app.get("/api/courses", async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/api/courses/:courseId", async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.status(200).json(course);
  } catch (err) {
    return res.status(404).json({ message: "Invalid course number" });
  }
});

app.post("/api/courses", validationSchema(), async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json(errors.array());
  }
  const course = new Course(req.body);
  try {
    await course.save();
    res.json(course);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

app.patch("/api/courses/:courseId", async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    const updatedCourse = await Course.updateOne(
      { _id: courseId },
      {
        $set: { ...req.body },
      }
    );
    res.status(200).json(updatedCourse);
  } catch (error) {
    return res.status(404).json({ message: "Invalid course number" });
  }
});

app.delete("/api/courses/:courseId", async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Not found" });
    }
    await Course.deleteOne({ _id: courseId });
    res.status(200).json({ success: true, msg: "Course deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Start the server
app.listen(4001, () => {
  console.log("Listening on port number 4001");
});
