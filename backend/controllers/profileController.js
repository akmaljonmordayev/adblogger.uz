const User = require('../models/User');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const { cloudinary } = require('../config/cloudinary');
const { Readable } = require('stream');

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

// PATCH /api/v1/profile/avatar  — accepts base64 data URI
exports.updateAvatar = catchAsync(async (req, res, next) => {
  const { avatar } = req.body;
  if (!avatar) return next(new AppError('Rasm yuklanmadi.', 400));
  if (!avatar.startsWith('data:image/')) {
    return next(new AppError('Noto\'g\'ri rasm formati.', 400));
  }

  // base64 data URI → Buffer
  const base64Data = avatar.replace(/^data:image\/\w+;base64,/, '');
  const buffer = Buffer.from(base64Data, 'base64');

  // Upload via stream (more reliable than passing data URI directly)
  const uploadResult = await new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: 'adblogger/avatars',
        resource_type: 'image',
        transformation: [{ width: 400, height: 400, crop: 'fill', gravity: 'face', quality: 'auto:good' }],
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    const readable = new Readable();
    readable.push(buffer);
    readable.push(null);
    readable.pipe(stream);
  });

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { avatar: uploadResult.secure_url },
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
