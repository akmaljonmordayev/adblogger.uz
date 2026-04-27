const Category = require('../models/Category');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// GET /api/v1/categories
exports.getAllCategories = catchAsync(async (req, res) => {
  const categories = await Category.find().sort('order name');
  res.status(200).json({ success: true, results: categories.length, data: categories });
});

// GET /api/v1/categories/:id
exports.getCategory = catchAsync(async (req, res, next) => {
  const category = await Category.findById(req.params.id);
  if (!category) return next(new AppError('Kategoriya topilmadi.', 404));
  res.status(200).json({ success: true, data: category });
});

// POST /api/v1/admin/categories
exports.createCategory = catchAsync(async (req, res) => {
  const category = await Category.create(req.body);
  res.status(201).json({ success: true, data: category });
});

// PATCH /api/v1/admin/categories/:id
exports.updateCategory = catchAsync(async (req, res, next) => {
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!category) return next(new AppError('Kategoriya topilmadi.', 404));
  res.status(200).json({ success: true, data: category });
});

// DELETE /api/v1/admin/categories/:id
exports.deleteCategory = catchAsync(async (req, res, next) => {
  const category = await Category.findByIdAndDelete(req.params.id);
  if (!category) return next(new AppError('Kategoriya topilmadi.', 404));
  res.status(204).json({ success: true, data: null });
});
