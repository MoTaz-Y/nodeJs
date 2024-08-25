const AppError = require("../utils/AppError");
const httpStatus = require("../utils/httpStatusText");
module.exports =
  (...role) =>
  (req, res, next) => {
    if (!role.includes(req.user.role)) {
      const error = AppError.create("unauthorized", 403, httpStatus.ERROR);
      return next(error);
    }
    next();
  };
