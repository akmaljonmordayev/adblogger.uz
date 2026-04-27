const Ad = require('../models/Ad');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');

// GET /api/v1/ads
exports.getAllAds = catchAsync(async (req, res) => {
  const filter = { status: { $in: ['approved', 'active'] } };
  if (req.query.type) filter.type = req.query.type;

  const features = new APIFeatures(
    Ad.find(filter).populate('user', 'firstName lastName avatar'),
    req.query
  )
    .search(['title', 'companyName', 'productName', 'description'])
    .sort()
    .limitFields()
    .paginate();

  const [ads, total] = await Promise.all([
    features.query,
    Ad.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    results: ads.length,
    total,
    page: features.page,
    limit: features.limit,
    data: ads,
  });
});

// GET /api/v1/ads/:id
exports.getAd = catchAsync(async (req, res, next) => {
  const ad = await Ad.findByIdAndUpdate(
    req.params.id,
    { $inc: { views: 1 } },
    { new: true }
  ).populate('user', 'firstName lastName avatar phone email');

  if (!ad) return next(new AppError('E\'lon topilmadi.', 404));

  res.status(200).json({ success: true, data: ad });
});

// POST /api/v1/ads
exports.createAd = catchAsync(async (req, res) => {
  const ad = await Ad.create({ ...req.body, user: req.user._id, status: 'pending' });

  res.status(201).json({ success: true, data: ad });
});

// PATCH /api/v1/ads/:id
exports.updateAd = catchAsync(async (req, res, next) => {
  const ad = await Ad.findOne({ _id: req.params.id, user: req.user._id });
  if (!ad) return next(new AppError('E\'lon topilmadi yoki ruxsat yo\'q.', 404));

  // Reset to pending after edit
  const disallowed = ['status', 'user', 'views'];
  disallowed.forEach((f) => delete req.body[f]);

  Object.assign(ad, req.body, { status: 'pending' });
  await ad.save();

  res.status(200).json({ success: true, data: ad });
});

// DELETE /api/v1/ads/:id
exports.deleteAd = catchAsync(async (req, res, next) => {
  const ad = await Ad.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!ad) return next(new AppError('E\'lon topilmadi yoki ruxsat yo\'q.', 404));

  res.status(204).json({ success: true, data: null });
});

// GET /api/v1/ads/my-ads
exports.getMyAds = catchAsync(async (req, res) => {
  const ads = await Ad.find({ user: req.user._id }).sort('-createdAt');
  res.status(200).json({ success: true, results: ads.length, data: ads });
});

// ── Admin ─────────────────────────────────────────────────────────────────────

exports.adminGetAllAds = catchAsync(async (req, res) => {
  const features = new APIFeatures(
    Ad.find().populate('user', 'firstName lastName email'),
    req.query
  )
    .filter()
    .search(['title', 'companyName'])
    .sort()
    .paginate();

  const [ads, total] = await Promise.all([features.query, Ad.countDocuments()]);

  res.status(200).json({ success: true, results: ads.length, total, data: ads });
});

// PATCH /api/v1/admin/ads/:id/status
exports.changeAdStatus = catchAsync(async (req, res, next) => {
  const { status } = req.body;
  const allowed = ['pending', 'approved', 'rejected', 'active', 'completed'];
  if (!allowed.includes(status)) return next(new AppError('Noto\'g\'ri status.', 400));

  const ad = await Ad.findByIdAndUpdate(req.params.id, { status }, { new: true });
  if (!ad) return next(new AppError('E\'lon topilmadi.', 404));

  res.status(200).json({ success: true, data: ad });
});
