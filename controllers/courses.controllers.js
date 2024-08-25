const { validationResult } = require("express-validator");
const Course = require("../models/courses.models");
const httpStatus = require("../utils/httpStatusText");
const asyncWrapper = require("../middleWares/asyncWrapper");
const AppError = require("../utils/appError");
// get all courses
const getAllCourses = asyncWrapper(async (req, res) => {
  const query = req.query;
  const limit = query.limit || 10;
  const page = query.page || 1;
  const skip = (page - 1) * limit;
  // get all courses from db using course model
  const courses = await Course.find({}, { __v: 0 }).limit(limit).skip(skip);
  if (!courses) {
    const error = AppError.create("courses not found", 404, httpStatus.FAIL);
    return next(error); // will send this error to the global error handler in the index.js
  }
  return res.json({ status: httpStatus.SUCCESS, data: { courses } });
});

// get single course
const getSingleCourse = asyncWrapper(async (req, res, next) => {
  const courseId = req.params.courseId;
  const course = await Course.findById(courseId);
  if (!course) {
    const error = AppError.create("courses not found", 404, httpStatus.FAIL);
    return next(error);
  }
  return res.status(200).json({ status: httpStatus.SUCCESS, data: { course } });
});

// create course
const createCourse = asyncWrapper(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = AppError.create(errors.array(), 400, httpStatus.FAIL);
    return next(error);
  }
  const course = new Course(req.body);
  await course.save();
  res.json({ status: httpStatus.SUCCESS, data: { course } });
});

// update course
const updateCourse = asyncWrapper(async (req, res, next) => {
  const courseId = req.params.courseId;
  const course = await Course.findById(courseId);
  if (!course) {
    const error = AppError.create("courses not found", 404, httpStatus.FAIL);
    return next(error);
  }
  const updatedCourse = await Course.updateOne(
    { _id: courseId },
    {
      $set: { ...req.body },
    }
  );
  return res
    .status(200)
    .json({ status: httpStatus.SUCCESS, data: { updatedCourse } });
});

// delete course
const deleteCourse = asyncWrapper(async (req, res, next) => {
  const courseId = req.params.courseId;
  const course = await Course.findById(courseId);
  if (!course) {
    const error = AppError.create("courses not found", 404, httpStatus.FAIL);
    return next(error);
  }
  await Course.deleteOne({ _id: courseId });
  res.status(200).json({ status: httpStatus.SUCCESS, data: null });
});

module.exports = {
  getAllCourses,
  getSingleCourse,
  createCourse,
  updateCourse,
  deleteCourse,
};
