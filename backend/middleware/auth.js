const jwt = require('jsonwebtoken');
const User = require('../models/User');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

// Verify JWT and attach user to req
exports.protect = catchAsync(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('Siz tizimga kirmagansiz. Iltimos, login qiling.', 401));
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  const user = await User.findById(decoded.id);
  if (!user) {
    return next(new AppError('Bu tokenga tegishli foydalanuvchi topilmadi.', 401));
  }

  if (user.changedPasswordAfter(decoded.iat)) {
    return next(new AppError('Parol o\'zgartirilgan. Iltimos, qayta login qiling.', 401));
  }

  if (!user.isActive) {
    return next(new AppError('Akkauntingiz bloklangan. Murojaat qiling.', 403));
  }

  req.user = user;
  next();
});

// Role-based access control
exports.restrictTo = (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError('Sizda bu amalni bajarish huquqi yo\'q.', 403));
    }
    next();
  };

// Optional auth — doesn't fail if no token, just attaches user if present
exports.optionalAuth = catchAsync(async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);
      if (user && user.isActive) req.user = user;
    } catch {
      // ignore invalid token
    }
  }
  next();
});
