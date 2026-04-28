const BlogPost = require('../models/BlogPost');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');

// GET /api/v1/blogs
exports.getAllBlogs = catchAsync(async (req, res) => {
  const filter = { isPublished: true };
  if (req.query.category) filter.category = req.query.category;

  const features = new APIFeatures(
    BlogPost.find(filter).populate('author', 'firstName lastName avatar'),
    req.query
  )
    .search(['title', 'excerpt', 'tags'])
    .sort()
    .limitFields()
    .paginate();

  const [blogs, total] = await Promise.all([features.query, BlogPost.countDocuments(filter)]);

  res.status(200).json({ success: true, results: blogs.length, total, page: features.page, data: blogs });
});

// GET /api/v1/blogs/:slugOrId
exports.getBlog = catchAsync(async (req, res, next) => {
  const query = req.params.slugOrId.match(/^[0-9a-fA-F]{24}$/)
    ? { _id: req.params.slugOrId }
    : { slug: req.params.slugOrId };

  const blog = await BlogPost.findOneAndUpdate(
    { ...query, isPublished: true },
    { $inc: { views: 1 } },
    { new: true }
  ).populate('author', 'firstName lastName avatar');

  if (!blog) return next(new AppError('Blog maqolasi topilmadi.', 404));

  res.status(200).json({ success: true, data: blog });
});

// ── Admin ─────────────────────────────────────────────────────────────────────

exports.adminGetAllBlogs = catchAsync(async (req, res) => {
  const features = new APIFeatures(
    BlogPost.find().populate('author', 'firstName lastName'),
    req.query
  ).filter().sort().paginate();

  const [blogs, total] = await Promise.all([features.query, BlogPost.countDocuments()]);
  res.status(200).json({ success: true, results: blogs.length, total, data: blogs });
});

exports.createBlog = catchAsync(async (req, res) => {
  const blog = await BlogPost.create({ ...req.body, author: req.user._id });
  res.status(201).json({ success: true, data: blog });
});

exports.updateBlog = catchAsync(async (req, res, next) => {
  const blog = await BlogPost.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!blog) return next(new AppError('Blog maqolasi topilmadi.', 404));
  res.status(200).json({ success: true, data: blog });
});

exports.deleteBlog = catchAsync(async (req, res, next) => {
  const blog = await BlogPost.findByIdAndDelete(req.params.id);
  if (!blog) return next(new AppError('Blog maqolasi topilmadi.', 404));
  res.status(204).json({ success: true, data: null });
});
