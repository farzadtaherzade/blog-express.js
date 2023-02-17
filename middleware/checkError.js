const { validationResult } = require("express-validator");

const checkValidaionErr = (req, res, next) => {
  const errors = {};
  const result = validationResult(req);
  if (result.errors.length > 0) {
    result.errors.forEach((err) => {
      errors[err.param] = err.msg;
    });
    return res.status(400).json({
      status: 400,
      errors,
    });
  }
  next();
};

module.exports = { checkValidaionErr };
