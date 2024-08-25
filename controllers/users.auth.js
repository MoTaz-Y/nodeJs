const asyncWrapper = require("../utils/asyncWrapper");
const AppError = require("../utils/appError");
const httpStatus = require("../utils/httpStatusText");
const User = require("../models/users.models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// register
const register = asyncWrapper(async (req, res, next) => {
  const { firstBname, lastName, email, password } = req.body;
  const oldUser = await User.findOne({ email:email });
  if (oldUser) {
    const error = AppError.create("user already exists", 400, httpStatus.FAIL);
    return next(error);
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const newUser = await User.create({
    firstBname,
    lastName,
    email,
    password: hashedPassword,
  });
  //generate jwt token
  jwt.sign({email:newUser.email, id: newUser._id}, secretOrPrivateKey)
  const token = newUser.generateJwtToken();

  await newUser.save();

  res.status(201).json({ status: httpStatus.SUCCESS, data: { newUser } });
});

//login
const login = asyncWrapper(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    const error = AppError.create(
      "please provide email and password",
      400,
      httpStatus.FAIL
    );
    return next(error);
  }
  const user = await User.findOne({ email : email }); 
  if (!user) {
    const error = AppError.create("user not found", 404, httpStatus.FAIL);
    return next(error);
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    const error = AppError.create("incorrect password", 400, httpStatus.FAIL);
    return next(error);
  }
  res.status(200).json({ status: httpStatus.SUCCESS, data: { user } });
});

module.exports = {
  register,
  login,
};
