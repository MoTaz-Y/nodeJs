const { body } = require("express-validator");

const validationSchema = () => {
  return [
    body("title").notEmpty().withMessage("needed not empty"),
    body("price")
      .notEmpty()
      .withMessage("needed not empty")
      .isLength({ min: 2 })
      .withMessage("needed not empty or less than 100"),
  ];
};

module.exports = {
  validationSchema,
};
