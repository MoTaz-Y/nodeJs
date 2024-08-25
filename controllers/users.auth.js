const asyncWrapper = require("../utils/asyncWrapper");
const AppError = require("../utils/appError");
const httpStatus = require("../utils/httpStatusText");
const User = require("../models/users.models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const generateJwt = require("../utils/generateJwt");
// register
const register = asyncWrapper(async (req, res, next) => {
  const { firstBname, lastName, email, password, role } = req.body;
  const oldUser = await User.findOne({ email: email });
  if (oldUser) {
    const error = AppError.create("user already exists", 400, httpStatus.FAIL);
    return next(error);
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt); //bcryptjs hash password
  const newUser = await User.create({
    firstBname,
    lastName,
    email,
    password: hashedPassword,
    role,
  });
  //generate jwt token
  const token = await generateJwt({
    email: newUser.email,
    id: newUser._id,
    role: newUser.role,
  });

  newUser.token = token;
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
  const user = await User.findOne({ email: email });
  if (!user) {
    const error = AppError.create("user not found", 404, httpStatus.FAIL);
    return next(error);
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    const error = AppError.create("incorrect password", 400, httpStatus.FAIL);
    return next(error);
  }

  const token = await generateJwt({
    email: user.email,
    id: user._id,
    role: user.role,
  });
  user.token = token;
  await user.save();

  res.status(200).json({ status: httpStatus.SUCCESS, data: { token } });
});

module.exports = {
  register,
  login,
};
