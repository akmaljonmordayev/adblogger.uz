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

  // Can't review yourself
  if (blogger.user.toString() === req.user._id.toString()) {
    return next(new AppError('O\'zingizga sharh yoza olmaysiz.', 400));
  }

  const review = await Review.create({
    blogger: req.params.bloggerId,
    reviewer: req.user._id,
    campaign: req.body.campaign,
    rating: req.body.rating,
    comment: req.body.comment,
  });

  res.status(201).json({ success: true, data: review });
});

// DELETE /api/v1/reviews/:id
exports.deleteReview = catchAsync(async (req, res, next) => {
  const review = await Review.findById(req.params.id);
  if (!review) return next(new AppError('Sharh topilmadi.', 404));

  const isOwner = review.reviewer.toString() === req.user._id.toString();
  const isAdmin = req.user.role === 'admin';

  if (!isOwner && !isAdmin) return next(new AppError('Ruxsat yo\'q.', 403));

  await Review.findByIdAndDelete(req.params.id);

  res.status(204).json({ success: true, data: null });
});
