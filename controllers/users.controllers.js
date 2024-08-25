const asyncWrapper = require("../utils/asyncWrapper");
const AppError = require("../utils/appError");
const httpStatus = require("../utils/httpStatusText");
const User = require("../models/users.models");

const getAllUsers = asyncWrapper(async (req, res) => {
  const limit = req.query.limit || 10;
  const page = req.query.page || 1;
  const skip = (page - 1) * limit;
  const users = await User.find({}, { __v: 0, password: 0 })
    .limit(limit)
    .skip(skip);
  if (!users) {
    const error = AppError.create("users not found", 404, httpStatus.FAIL);
    return next(error); // will send this error to the global error handler in the index.js
  }
  return res.json({ status: httpStatus.SUCCESS, data: { users } });
});

// update user
const updateUser = asyncWrapper(async (req, res, next) => {
  const userId = req.params.userId;
  const user = await User.findById(userId);
  if (!user) {
    const error = AppError.create("users not found", 404, httpStatus.FAIL);
    return next(error);
  }
  const updatedUser = await User.updateOne(
    { _id: userId },
    {
      $set: { ...req.body },
    }
  );
  return res
    .status(200)
    .json({ status: httpStatus.SUCCESS, data: { updatedUser } });
});

// delete user
const deleteUser = asyncWrapper(async (req, res, next) => {
  const userId = req.params.userId;
  const user = await User.findById(userId);
  if (!user) {
    const error = AppError.create("users not found", 404, httpStatus.FAIL);
    return next(error);
  }
  const deletedUser = await User.deleteOne({ _id: userId });
  return res
    .status(200)
    .json({ status: httpStatus.SUCCESS, data: { deletedUser } });
});

module.exports = {
  getAllUsers,
  updateUser,
  deleteUser,
};
