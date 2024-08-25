const express = require("express");
const router = express.Router();

const { validationSchema } = require("../middleWares/courses.middleware");

const coursesCRUD = require("../controllers/courses.controllers");
// get all courses
router
  .route(`/`)
  .get(coursesCRUD.getAllCourses) //get all the courses
  .post(
    //create course
    validationSchema(),
    coursesCRUD.createCourse
  );

router
  .route(`/:courseId`)
  .get(coursesCRUD.getSingleCourse) // get one course
  .patch(coursesCRUD.updateCourse) // update course
  .delete(coursesCRUD.deleteCourse); // delete course

module.exports = router;
