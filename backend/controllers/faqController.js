const FAQ = require('../models/FAQ');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getAllFAQs = catchAsync(async (req, res) => {
  const filter = { isActive: true };
  if (req.query.category) filter.category = req.query.category;
  const faqs = await FAQ.find(filter).sort('order');
  res.status(200).json({ success: true, results: faqs.length, data: faqs });
});

exports.adminGetAllFAQs = catchAsync(async (req, res) => {
  const faqs = await FAQ.find().sort('order');
  res.status(200).json({ success: true, results: faqs.length, data: faqs });
});

exports.createFAQ = catchAsync(async (req, res) => {
  const faq = await FAQ.create(req.body);
  res.status(201).json({ success: true, data: faq });
});

exports.updateFAQ = catchAsync(async (req, res, next) => {
  const faq = await FAQ.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!faq) return next(new AppError('FAQ topilmadi.', 404));
  res.status(200).json({ success: true, data: faq });
});

exports.deleteFAQ = catchAsync(async (req, res, next) => {
  const faq = await FAQ.findByIdAndDelete(req.params.id);
  if (!faq) return next(new AppError('FAQ topilmadi.', 404));
  res.status(204).json({ success: true, data: null });
});
