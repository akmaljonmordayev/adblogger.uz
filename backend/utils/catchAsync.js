// Wraps async route handlers to forward errors to Express error handler
const catchAsync = (fn) => (req, res, next) => fn(req, res, next).catch(next);

module.exports = catchAsync;
