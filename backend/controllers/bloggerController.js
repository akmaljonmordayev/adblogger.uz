const Blogger = require('../models/Blogger');
const User = require('../models/User');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');

// GET /api/v1/bloggers
exports.getAllBloggers = catchAsync(async (req, res) => {
  const features = new APIFeatures(
    Blogger.find({ isActive: true }).populate('user', 'firstName lastName avatar email phone'),
    req.query
  )
    .filter()
    .search(['handle'])
    .sort()
    .limitFields()
    .paginate();

  const [bloggers, total] = await Promise.all([
    features.query,
    Blogger.countDocuments({ isActive: true }),
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
    Blogger.find().populate('user', 'firstName lastName avatar email'),
    req.query
  )
    .filter()
    .sort()
    .paginate();

  const [bloggers, total] = await Promise.all([
    features.query,
    Blogger.countDocuments(),
  ]);

  res.status(200).json({ success: true, results: bloggers.length, total, data: bloggers });
});

// PATCH /api/v1/admin/bloggers/:id/verify
exports.verifyBlogger = catchAsync(async (req, res, next) => {
  const blogger = await Blogger.findByIdAndUpdate(
    req.params.id,
    { isVerified: req.body.isVerified },
    { new: true }
  );
  if (!blogger) return next(new AppError('Blogger topilmadi.', 404));

  res.status(200).json({ success: true, data: blogger });
});
