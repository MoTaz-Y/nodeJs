const express = require("express");
const app = express();
const mongoose = require("mongoose");
const coursesRouter = require("./routes/courses.routes");
const usersRouter = require("./routes/users.routes");
const cors = require("cors");
const httpStatus = require("./utils/httpStatusText");

require("dotenv").config(); // for env variables
const url = process.env.MONGO_URL;
app.use(express.json()); // for parsing application/json body parser

mongoose
  .connect(url)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.error("MongoDB connection error", err);
  });
app.use(cors()); // for cors
app.use("/api/courses", coursesRouter); // /api/courses
app.use("/api/users", usersRouter); // /api/users

// global middleware for not found router
app.all("*", (req, res) => {
  //* means any route you want
  return res.status(404).json({
    status: httpStatus.ERROR,
    data: null,
    message: "Invalid",
  });
});
// global middleware for not error handler
app.use((error, req, res, next) => {
  res.status(error.statusCode || 500).json({
    status: error.statusText || httpStatus.ERROR,
    message: error.message,
    code: error.statusCode || 500,
    data: null,
  });
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Listening on port number 4000");
});
