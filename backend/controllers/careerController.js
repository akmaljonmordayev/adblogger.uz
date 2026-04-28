const Career = require('../models/Career');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getAllCareers = catchAsync(async (req, res) => {
  const careers = await Career.find({ isActive: true }).sort('-createdAt');
  res.status(200).json({ success: true, results: careers.length, data: careers });
});

exports.getCareer = catchAsync(async (req, res, next) => {
  const career = await Career.findById(req.params.id);
  if (!career || !career.isActive) return next(new AppError('Vakansiya topilmadi.', 404));
  res.status(200).json({ success: true, data: career });
});

exports.adminGetAllCareers = catchAsync(async (req, res) => {
  const careers = await Career.find().sort('-createdAt');
  res.status(200).json({ success: true, results: careers.length, data: careers });
});

exports.createCareer = catchAsync(async (req, res) => {
  const career = await Career.create(req.body);
  res.status(201).json({ success: true, data: career });
});

exports.updateCareer = catchAsync(async (req, res, next) => {
  const career = await Career.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!career) return next(new AppError('Vakansiya topilmadi.', 404));
  res.status(200).json({ success: true, data: career });
});

exports.deleteCareer = catchAsync(async (req, res, next) => {
  const career = await Career.findByIdAndDelete(req.params.id);
  if (!career) return next(new AppError('Vakansiya topilmadi.', 404));
  res.status(204).json({ success: true, data: null });
});
