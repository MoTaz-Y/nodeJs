const express = require("express");
const router = express.Router();
const verifyToken = require("../middleWares/verifyToken");
const multer = require("multer");

const { validationSchema } = require("../middleWares/courses.middleware");

const usersController = require("../controllers/users.controllers");
const usersAuth = require("../controllers/users.auth");
const appError = require("../utils/appError");

const diskStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = file.mimetype.split("/")[1];
    cb(null, file.fieldname + "-" + uniqueSuffix + "." + ext);
  },
});

const fileFilter = (req, file, cb) => {
  const imageTypes = ["image/png", "image/jpg", "image/jpeg"];
  if (imageTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    return cb(
      appError.create("Only .png, .jpg and .jpeg format allowed!", 400, false)
    );
  }
};

const upload = multer({
  storage: diskStorage,
  limits: { fileSize: 1024 * 1024 * 5 },
  fileFilter,
});
// get all users

router.route(`/`).get(verifyToken, usersController.getAllUsers); //get all the users

// register
router.route(`/register`).post(
  //register
  upload.sinfle("avatar"),
  validationSchema(),
  usersAuth.register
);

router
  .route(`/:userEmail`)
  .patch(usersController.updateUser) // update user
  .delete(usersController.deleteUser); // delete user
router.route(`/login`).get(usersAuth.login); // login

module.exports = router;
