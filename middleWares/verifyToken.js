const jwt = require("jsonwebtoken");
const AppError = require("../utils/AppError");
const httpStatus = require("../utils/httpStatusText");
const verifyToken = (req, res, next) => {
  const authHeader =
    req.headers["authorization"] || req.headers["Authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    const error = AppError.create("unauthorized", 401, httpStatus.ERROR);
    return next(error);
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      const error = AppError.create("invalid token", 403, httpStatus.ERROR);
      return next(error);
    }
    req.user = user;
  });
  next();
};
module.exports = verifyToken;
