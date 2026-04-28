const User = require('../models/User');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// PATCH /api/v1/profile
exports.updateProfile = catchAsync(async (req, res, next) => {
  const disallowed = ['password', 'role', 'isVerified', 'isActive'];
  disallowed.forEach((f) => delete req.body[f]);

  const user = await User.findByIdAndUpdate(req.user._id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!user) return next(new AppError('Foydalanuvchi topilmadi.', 404));

  res.status(200).json({ success: true, data: user });
});

// PATCH /api/v1/profile/avatar
exports.updateAvatar = catchAsync(async (req, res, next) => {
  if (!req.file) return next(new AppError('Rasm yuklanmadi.', 400));

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { avatar: req.file.path },
    { new: true }
  );

  res.status(200).json({ success: true, data: user });
});

// ── Admin ─────────────────────────────────────────────────────────────────────

exports.adminGetAllUsers = catchAsync(async (req, res) => {
  const filter = {};
  if (req.query.role) filter.role = req.query.role;
  if (req.query.isActive !== undefined) filter.isActive = req.query.isActive === 'true';

  const users = await User.find(filter).sort('-createdAt');
  res.status(200).json({ success: true, results: users.length, data: users });
});

exports.adminGetUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) return next(new AppError('Foydalanuvchi topilmadi.', 404));
  res.status(200).json({ success: true, data: user });
});

exports.adminUpdateUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!user) return next(new AppError('Foydalanuvchi topilmadi.', 404));
  res.status(200).json({ success: true, data: user });
});

exports.adminDeleteUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
  if (!user) return next(new AppError('Foydalanuvchi topilmadi.', 404));
  res.status(200).json({ success: true, message: 'Foydalanuvchi bloklandi.' });
});
