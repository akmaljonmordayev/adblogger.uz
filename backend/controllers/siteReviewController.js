const SiteReview = require('../models/SiteReview');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// GET /api/v1/site-reviews — Public: get approved reviews
exports.getReviews = catchAsync(async (req, res) => {
  const { limit = 20, page = 1 } = req.query;
  const skip = (page - 1) * Number(limit);

  const reviews = await SiteReview.find({ isApproved: true })
    .sort('-createdAt')
    .skip(skip)
    .limit(Number(limit))
    .populate('user', 'firstName lastName avatar role');

  // Merge user data with display data
  const mapped = reviews.map(r => {
    const obj = r.toObject();
    if (obj.user) {
      obj.displayName   = `${obj.user.firstName} ${obj.user.lastName}`.trim();
      obj.displayRole   = obj.user.role === 'blogger' ? 'Blogger' : obj.user.role === 'business' ? 'Biznesmen' : '';
      obj.displayAvatar = obj.user.avatar || '';
    }
    return obj;
  });

  const total = await SiteReview.countDocuments({ isApproved: true });

  res.status(200).json({ success: true, total, data: mapped });
});

// GET /api/v1/site-reviews/my — Protected: get my review
exports.getMyReview = catchAsync(async (req, res) => {
  const review = await SiteReview.findOne({ user: req.user._id });
  res.status(200).json({ success: true, data: review || null });
});

// POST /api/v1/site-reviews — Protected: create review
exports.createReview = catchAsync(async (req, res, next) => {
  const { rating, comment } = req.body;

  if (!rating || rating < 1 || rating > 5) {
    return next(new AppError('Baho 1 dan 5 gacha bo\'lishi kerak.', 400));
  }

  const existing = await SiteReview.findOne({ user: req.user._id });
  if (existing) {
    return next(new AppError('Siz allaqachon baholagan edingiz.', 409));
  }

  const sanitizedComment = comment ? String(comment).replace(/[<>]/g, '').trim().slice(0, 1000) : '';

  const review = await SiteReview.create({
    user:    req.user._id,
    rating:  Number(rating),
    comment: sanitizedComment,
  });

  res.status(201).json({ success: true, data: review });
});

// PUT /api/v1/site-reviews/my — Protected: update my review
exports.updateMyReview = catchAsync(async (req, res, next) => {
  const { rating, comment } = req.body;

  const review = await SiteReview.findOne({ user: req.user._id });
  if (!review) return next(new AppError('Sizda hali baho yo\'q.', 404));

  if (rating) review.rating = Number(rating);
  if (comment !== undefined) review.comment = String(comment).replace(/[<>]/g, '').trim().slice(0, 1000);
  await review.save();

  res.status(200).json({ success: true, data: review });
});
