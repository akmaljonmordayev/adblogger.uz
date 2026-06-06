const Review = require('../models/Review');
const Blogger = require('../models/Blogger');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// GET /api/v1/bloggers/:bloggerId/reviews
exports.getBloggerReviews = catchAsync(async (req, res) => {
  const reviews = await Review.find({ blogger: req.params.bloggerId })
    .populate('reviewer', 'firstName lastName avatar')
    .sort('-createdAt');

  res.status(200).json({ success: true, results: reviews.length, data: reviews });
});

// POST /api/v1/bloggers/:bloggerId/reviews
exports.createReview = catchAsync(async (req, res, next) => {
  const blogger = await Blogger.findById(req.params.bloggerId);
  if (!blogger) return next(new AppError('Blogger topilmadi.', 404));

  if (blogger.user.toString() === req.user._id.toString()) {
    return next(new AppError("O'zingizga sharh yoza olmaysiz.", 400));
  }

  // Check if already reviewed
  const existing = await Review.findOne({ blogger: req.params.bloggerId, reviewer: req.user._id });
  if (existing) return next(new AppError('Siz bu bloggerga allaqachon sharh qoldirgansiz.', 400));

  const review = await Review.create({
    blogger:  req.params.bloggerId,
    reviewer: req.user._id,
    campaign: req.body.campaign,
    rating:   Number(req.body.rating),
    comment:  req.body.comment ? String(req.body.comment).trim() : undefined,
  });

  await review.populate('reviewer', 'firstName lastName avatar');

  res.status(201).json({ success: true, data: review });
});

// PATCH /api/v1/bloggers/:bloggerId/reviews/:id
exports.updateReview = catchAsync(async (req, res, next) => {
  const review = await Review.findById(req.params.id);
  if (!review) return next(new AppError('Sharh topilmadi.', 404));

  if (review.reviewer.toString() !== req.user._id.toString()) {
    return next(new AppError("Faqat o'z sharhingizni tahrirlashingiz mumkin.", 403));
  }

  if (req.body.rating !== undefined) review.rating = Number(req.body.rating);
  if (req.body.comment !== undefined) review.comment = String(req.body.comment).trim();

  await review.save();
  await review.populate('reviewer', 'firstName lastName avatar');

  res.status(200).json({ success: true, data: review });
});

// DELETE /api/v1/bloggers/:bloggerId/reviews/:id
exports.deleteReview = catchAsync(async (req, res, next) => {
  const review = await Review.findById(req.params.id);
  if (!review) return next(new AppError('Sharh topilmadi.', 404));

  const isOwner = review.reviewer.toString() === req.user._id.toString();
  const isAdmin = req.user.role === 'admin';

  if (!isOwner && !isAdmin) return next(new AppError("Ruxsat yo'q.", 403));

  await Review.findByIdAndDelete(req.params.id);

  res.status(204).json({ success: true, data: null });
});

// POST /api/v1/bloggers/:bloggerId/reviews/:id/like
exports.toggleLike = catchAsync(async (req, res, next) => {
  const review = await Review.findById(req.params.id);
  if (!review) return next(new AppError('Sharh topilmadi.', 404));

  const userId = req.user._id.toString();
  const likedIndex = review.likes.findIndex(id => id.toString() === userId);

  if (likedIndex === -1) {
    review.likes.push(req.user._id);
  } else {
    review.likes.splice(likedIndex, 1);
  }

  await review.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    data: { likes: review.likes, likesCount: review.likes.length, liked: likedIndex === -1 },
  });
});
