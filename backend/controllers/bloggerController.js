const Blogger = require('../models/Blogger');
const User = require('../models/User');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');

// GET /api/v1/bloggers
exports.getAllBloggers = catchAsync(async (req, res) => {
  // Exclude blocked/frozen users from public listing
  const blockedUserIds = await User.find({ $or: [{ isBlocked: true }, { isFrozen: true }, { isActive: false }] }).distinct('_id');

  const features = new APIFeatures(
    Blogger.find({ isActive: true, isVerified: true, user: { $nin: blockedUserIds } }).populate('user', 'firstName lastName avatar email phone'),
    req.query
  )
    .filter()
    .search(['handle'])
    .sort()
    .limitFields()
    .paginate();

  const [bloggers, total] = await Promise.all([
    features.query,
    Blogger.countDocuments({ isActive: true, isVerified: true, user: { $nin: blockedUserIds } }),
  ]);

  res.status(200).json({
    success: true,
    results: bloggers.length,
    total,
    page: features.page,
    limit: features.limit,
    data: bloggers,
  });
});

// GET /api/v1/bloggers/:id
exports.getBlogger = catchAsync(async (req, res, next) => {
  const blogger = await Blogger.findById(req.params.id)
    .populate('user', 'firstName lastName avatar email phone');

  if (!blogger) return next(new AppError('Blogger topilmadi.', 404));

  res.status(200).json({ success: true, data: blogger });
});

// GET /api/v1/bloggers/my-profile  (authenticated blogger)
exports.getMyProfile = catchAsync(async (req, res, next) => {
  const blogger = await Blogger.findOne({ user: req.user._id })
    .populate('user', 'firstName lastName avatar email phone');

  if (!blogger) return next(new AppError('Blogger profili topilmadi.', 404));

  res.status(200).json({ success: true, data: blogger });
});

// PATCH /api/v1/bloggers/my-profile
exports.updateMyProfile = catchAsync(async (req, res, next) => {
  const allowedFields = [
    'handle', 'bio', 'platforms', 'socialLinks', 'followers', 'followersRange',
    'engagementRate', 'categories', 'services', 'pricing', 'portfolio', 'location',
    'language', 'gender', 'website', 'audienceAge', 'audienceGender',
  ];

  const updates = {};
  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) updates[field] = req.body[field];
  });

  const blogger = await Blogger.findOneAndUpdate(
    { user: req.user._id },
    { $set: updates },
    { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
  ).populate('user', 'firstName lastName avatar email phone');

  if (!blogger) return next(new AppError('Blogger profili topilmadi.', 404));

  res.status(200).json({ success: true, data: blogger });
});

// ── Admin only ────────────────────────────────────────────────────────────────

// GET /api/v1/admin/bloggers
exports.adminGetAllBloggers = catchAsync(async (req, res) => {
  const features = new APIFeatures(
    Blogger.find().populate('user', 'firstName lastName avatar email isBlocked isFrozen isActive'),
    req.query
  )
    .filter()
    .sort()
    .paginate();

  const [bloggers, total] = await Promise.all([
    features.query,
    Blogger.countDocuments(),
  ]);

  // Merge user isBlocked/isFrozen into blogger objects for frontend convenience
  const data = bloggers.map(b => {
    const obj = b.toObject();
    if (obj.user) {
      obj.isBlocked = obj.user.isBlocked || false;
      obj.isFrozen  = obj.user.isFrozen  || false;
    }
    return obj;
  });

  res.status(200).json({ success: true, results: data.length, total, data });
});

// PATCH /api/v1/admin/bloggers/:id/verify
exports.verifyBlogger = catchAsync(async (req, res, next) => {
  const blogger = await Blogger.findByIdAndUpdate(
    req.params.id,
    { isVerified: req.body.isVerified },
    { new: true }
  ).populate('user', 'firstName lastName avatar email isBlocked isFrozen isActive');
  if (!blogger) return next(new AppError('Blogger topilmadi.', 404));

  const obj = blogger.toObject();
  if (obj.user) {
    obj.isBlocked = obj.user.isBlocked || false;
    obj.isFrozen  = obj.user.isFrozen  || false;
  }
  res.status(200).json({ success: true, data: obj });
});

// PATCH /api/v1/admin/bloggers/:id/block
exports.blockBlogger = catchAsync(async (req, res, next) => {
  const blogger = await Blogger.findById(req.params.id);
  if (!blogger) return next(new AppError('Blogger topilmadi.', 404));

  const { isBlocked } = req.body;
  if (typeof isBlocked !== 'boolean') {
    return next(new AppError('isBlocked qiymati boolean bo\'lishi kerak.', 400));
  }

  const user = await User.findByIdAndUpdate(
    blogger.user,
    { isBlocked },
    { new: true }
  );
  if (!user) return next(new AppError('Foydalanuvchi topilmadi.', 404));

  res.status(200).json({ success: true, data: { isBlocked: user.isBlocked } });
});

// PATCH /api/v1/admin/bloggers/:id/freeze
exports.freezeBlogger = catchAsync(async (req, res, next) => {
  const blogger = await Blogger.findById(req.params.id);
  if (!blogger) return next(new AppError('Blogger topilmadi.', 404));

  const { isFrozen } = req.body;
  if (typeof isFrozen !== 'boolean') {
    return next(new AppError('isFrozen qiymati boolean bo\'lishi kerak.', 400));
  }

  const user = await User.findByIdAndUpdate(
    blogger.user,
    { isFrozen },
    { new: true }
  );
  if (!user) return next(new AppError('Foydalanuvchi topilmadi.', 404));

  res.status(200).json({ success: true, data: { isFrozen: user.isFrozen } });
});

// DELETE /api/v1/admin/bloggers/:id
exports.adminDeleteBlogger = catchAsync(async (req, res, next) => {
  const blogger = await Blogger.findByIdAndDelete(req.params.id);
  if (!blogger) return next(new AppError('Blogger topilmadi.', 404));

  // Also delete associated user account
  if (blogger.user) {
    await User.findByIdAndDelete(blogger.user);
  }

  res.status(204).json({ success: true, data: null });
});
