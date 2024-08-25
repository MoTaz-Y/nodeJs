const express = require("express");
const router = express.Router();

const { validationSchema } = require("../middleWares/courses.middleware");

const coursesCRUD = require("../controllers/courses.controllers");
const verifyToken = require("../middleWares/verifyToken");
const allowedTo = require("../middleWares/allowedTo");
const userRole = require("../utils/userRole");
// get all courses
router
  .route(`/`)
  .get(coursesCRUD.getAllCourses) //get all the courses
  .post(
    //create course
    verifyToken,
    allowedTo(userRole.ADMIN, userRole.MANAGER),
    validationSchema(),
    coursesCRUD.createCourse
  );

router
  .route(`/:courseId`)
  .get(coursesCRUD.getSingleCourse) // get one course
  .patch(coursesCRUD.updateCourse) // update course
  .delete(
    verifyToken,
    allowedTo(userRole.ADMIN, userRole.MANAGER),
    coursesCRUD.deleteCourse
  ); // delete course

module.exports = router;
