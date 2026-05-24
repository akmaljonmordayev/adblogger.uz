const Category = require('../models/Category');
const Blogger  = require('../models/Blogger');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

/* shared helper — recalculate all category blogger counts at once */
async function recalcAllCounts() {
  const counts = await Blogger.aggregate([
    { $unwind: '$categories' },
    { $group: { _id: '$categories', count: { $sum: 1 } } },
  ]);
  const countMap = {};
  counts.forEach(({ _id, count }) => { countMap[_id] = count; });

  const categories = await Category.find().select('name');
  await Promise.all(
    categories.map(c =>
      Category.findByIdAndUpdate(c._id, { bloggerCount: countMap[c.name] || 0 })
    )
  );
  return countMap;
}

// GET /api/v1/categories  (ham admin, ham public ishlatadi)
exports.getAllCategories = catchAsync(async (req, res) => {
  const [categories, bloggerCounts] = await Promise.all([
    Category.find().sort('order name'),
    Blogger.aggregate([
      { $unwind: '$categories' },
      { $group: { _id: '$categories', count: { $sum: 1 } } },
    ]),
  ]);

  const countMap = {};
  bloggerCounts.forEach(({ _id, count }) => { countMap[_id] = count; });

  // Return real-time count (do not rely on stale bloggerCount field)
  const data = categories.map(c => ({
    ...c.toObject(),
    bloggerCount: countMap[c.name] || 0,
  }));

  res.status(200).json({ success: true, results: data.length, data });
});

// POST /api/v1/admin/categories/sync-counts  — one-time resync for existing data
exports.syncAllBloggerCounts = catchAsync(async (req, res) => {
  const countMap = await recalcAllCounts();
  res.status(200).json({ success: true, message: 'Blogger counts synced', counts: countMap });
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
