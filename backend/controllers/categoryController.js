const Category = require('../models/Category');
const Blogger  = require('../models/Blogger');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

/* Blogger modelidagi barcha kategoriya nomlari */
const BLOGGER_CATEGORY_ENUM = [
  'Tech', 'Lifestyle', 'Beauty', 'Food', 'Sports',
  'Travel', 'Education', 'Business', 'Gaming', 'Music', 'Other',
];

const DEFAULT_ICONS = {
  Tech: '💻', Lifestyle: '😊', Beauty: '💄', Food: '🍴',
  Sports: '⚽', Travel: '✈️', Education: '📚', Business: '💼',
  Gaming: '🎮', Music: '🎵', Other: '🏷️',
};

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

/* blogger enum dagi barcha kategoriyalarni DB ga avtomatik yaratish */
async function ensureDefaultCategories() {
  for (let i = 0; i < BLOGGER_CATEGORY_ENUM.length; i++) {
    const name = BLOGGER_CATEGORY_ENUM[i];
    const exists = await Category.findOne({ name });
    if (!exists) {
      await Category.create({
        name,
        slug: name.toLowerCase(),
        icon: DEFAULT_ICONS[name] || '',
        order: i,
        bloggerCount: 0,
      });
    }
  }
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

  // Category hujjatlar bo'lmagan lekin bloggerlarda mavjud kategoriyalarni ham qo'shish
  const catByName = {};
  categories.forEach(c => { catByName[c.name] = c; });

  const allNames = new Set([
    ...categories.map(c => c.name),
    ...bloggerCounts.map(b => b._id),
  ]);

  const data = [...allNames].map((name, i) => {
    const cat = catByName[name];
    if (cat) {
      return { ...cat.toObject(), bloggerCount: countMap[name] || 0 };
    }
    // DB da Category hujjati yo'q, lekin bloggerlarda bor
    return {
      _id: null,
      name,
      slug: name.toLowerCase(),
      icon: DEFAULT_ICONS[name] || '🏷️',
      description: '',
      color: '#6366f1',
      bloggerCount: countMap[name] || 0,
      adCount: 0,
      isFeatured: false,
      order: 999,
      _noDoc: true,
    };
  }).sort((a, b) => (a.order ?? 999) - (b.order ?? 999) || a.name.localeCompare(b.name));

  res.status(200).json({ success: true, results: data.length, data });
});

// POST /api/v1/admin/categories/sync-counts  — resync + missing kategoriyalarni avtomatik yaratish
exports.syncAllBloggerCounts = catchAsync(async (req, res) => {
  await ensureDefaultCategories();
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
