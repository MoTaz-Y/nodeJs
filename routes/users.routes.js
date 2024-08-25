const express = require("express");
const router = express.Router();
const verifyToken = require("../middleWares/verifyToken");

const { validationSchema } = require("../middleWares/courses.middleware");

const usersController = require("../controllers/users.controllers");
const usersAuth = require("../controllers/users.auth");
// get all users
router.route(`/`).get(verifyToken, usersController.getAllUsers); //get all the users

// register
router.route(`/register`).post(
  //register
  validationSchema(),
  usersAuth.register
);

router
  .route(`/:userEmail`)
  .patch(usersController.updateUser) // update user
  .delete(usersController.deleteUser); // delete user
router.route(`/login`).get(usersAuth.login); // login

module.exports = router;
