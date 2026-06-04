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

// PATCH /api/v1/profile/avatar — multipart/form-data, field: avatar
exports.updateAvatar = catchAsync(async (req, res, next) => {
  if (!req.file) return next(new AppError('Rasm yuklanmadi.', 400));

  const avatarUrl = req.file.secure_url || req.file.path;
  if (!avatarUrl) return next(new AppError('Cloudinary URL olinmadi.', 500));

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { avatar: avatarUrl },
    { new: true }
  );

  res.status(200).json({ success: true, data: user });
});

// ── Admin ─────────────────────────────────────────────────────────────────────

exports.adminGetAllUsers = catchAsync(async (req, res) => {
  const filter = {};
  if (req.query.role) filter.role = req.query.role;
  if (req.query.isActive !== undefined) filter.isActive = req.query.isActive === 'true';
  if (req.query.search) {
    const q = req.query.search.trim();
    filter.$or = [
      { firstName: { $regex: q, $options: 'i' } },
      { lastName:  { $regex: q, $options: 'i' } },
      { email:     { $regex: q, $options: 'i' } },
    ];
  }

  const page  = Math.max(1, parseInt(req.query.page)  || 1);
  const limit = Math.max(1, parseInt(req.query.limit) || 10);
  const skip  = (page - 1) * limit;

  // Global stats — always based on all users, no filter
  const [users, total, totalActive, totalBlocked, totalBloggers, totalBusinesses] = await Promise.all([
    User.find(filter).sort('-createdAt').skip(skip).limit(limit),
    User.countDocuments(filter),
    User.countDocuments({ isActive: true }),
    User.countDocuments({ isActive: false }),
    User.countDocuments({ role: 'blogger' }),
    User.countDocuments({ role: 'business' }),
  ]);

  res.status(200).json({
    success: true,
    results: total,
    totalActive,
    totalBlocked,
    totalBloggers,
    totalBusinesses,
    data: users,
  });
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
  const user = await User.findById(req.params.id);
  if (!user) return next(new AppError('Foydalanuvchi topilmadi.', 404));
  if (user.role === 'admin') return next(new AppError('Admin hisobini o\'chirish mumkin emas.', 403));

  await User.findByIdAndDelete(req.params.id);
  res.status(200).json({ success: true, message: 'Foydalanuvchi o\'chirildi.' });
});
