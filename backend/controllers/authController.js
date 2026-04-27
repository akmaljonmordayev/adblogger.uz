const crypto = require('crypto');
const User = require('../models/User');
const Blogger = require('../models/Blogger');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const { sendTokenResponse } = require('../utils/generateToken');
const sendEmail = require('../utils/sendEmail');

// POST /api/v1/auth/register
exports.register = catchAsync(async (req, res, next) => {
  const { firstName, lastName, email, phone, password, role } = req.body;

  const allowedRoles = ['user', 'blogger', 'business'];
  const userRole = allowedRoles.includes(role) ? role : 'user';

  const user = await User.create({ firstName, lastName, email, phone, password, role: userRole });

  // If registering as blogger, create empty blogger profile
  if (userRole === 'blogger') {
    await Blogger.create({ user: user._id });
  }

  sendTokenResponse(user, 201, res);
});

// POST /api/v1/auth/login
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Email va parol kiritilishi shart.', 400));
  }

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Email yoki parol noto\'g\'ri.', 401));
  }

  if (!user.isActive) {
    return next(new AppError('Akkauntingiz bloklangan.', 403));
  }

  sendTokenResponse(user, 200, res);
});

// POST /api/v1/auth/admin-login
exports.adminLogin = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Email va parol kiritilishi shart.', 400));
  }

  const user = await User.findOne({ email, role: 'admin' }).select('+password');
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Admin email yoki parol noto\'g\'ri.', 401));
  }

  sendTokenResponse(user, 200, res);
});

// GET /api/v1/auth/me
exports.getMe = catchAsync(async (req, res) => {
  const user = await User.findById(req.user._id);
  res.status(200).json({ success: true, data: user });
});

// PATCH /api/v1/auth/update-password
exports.updatePassword = catchAsync(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id).select('+password');
  if (!(await user.correctPassword(currentPassword, user.password))) {
    return next(new AppError('Joriy parol noto\'g\'ri.', 401));
  }

  user.password = newPassword;
  await user.save();

  sendTokenResponse(user, 200, res);
});

// POST /api/v1/auth/forgot-password
exports.forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('Bu email bilan foydalanuvchi topilmadi.', 404));
  }

  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  const resetURL = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

  try {
    await sendEmail({
      to: user.email,
      subject: 'Parolni tiklash (10 daqiqa amal qiladi)',
      html: `<p>Parolni tiklash uchun quyidagi havolani bosing:</p>
             <a href="${resetURL}">${resetURL}</a>
             <p>Agar siz so'rov bermagan bo'lsangiz, bu emailni e'tiborsiz qoldiring.</p>`,
    });

    res.status(200).json({ success: true, message: 'Reset token emailga yuborildi.' });
  } catch {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new AppError('Email yuborishda xatolik. Keyinroq urinib ko\'ring.', 500));
  }
});

// PATCH /api/v1/auth/reset-password/:token
exports.resetPassword = catchAsync(async (req, res, next) => {
  const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new AppError('Token noto\'g\'ri yoki muddati tugagan.', 400));
  }

  user.password = req.body.password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  sendTokenResponse(user, 200, res);
});
