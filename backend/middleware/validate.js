const { validationResult } = require('express-validator');
const AppError = require('../utils/appError');

// Run validation result and pass errors to next
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages = errors.array().map((e) => e.msg).join(', ');
    return next(new AppError(messages, 400));
  }
  next();
};

module.exports = validate;
