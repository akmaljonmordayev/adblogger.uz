const BlogPost = require('../models/BlogPost');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');

/* ── Public ─────────────────────────────────────────────────────────────── */

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

  const data = blogs.map(b => {
    const obj = b.toObject();
    obj.likesCount = obj.likes ? obj.likes.length : 0;
    delete obj.likes;
    return obj;
  });

  res.status(200).json({ success: true, results: data.length, total, page: features.page, data });
});

// GET /api/v1/blogs/my  ← must be registered BEFORE /:slugOrId
exports.getMyBlogs = catchAsync(async (req, res) => {
  const blogs = await BlogPost.find({ author: req.user._id })
    .sort('-createdAt')
    .populate('author', 'firstName lastName avatar');

  res.status(200).json({ success: true, results: blogs.length, data: blogs });
});

// GET /api/v1/blogs/:slugOrId
exports.getBlog = catchAsync(async (req, res, next) => {
  const query = req.params.slugOrId.match(/^[0-9a-fA-F]{24}$/)
    ? { _id: req.params.slugOrId }
    : { slug: req.params.slugOrId };

  // Published OR author viewing their own draft
  let blog = await BlogPost.findOneAndUpdate(
    { ...query, isPublished: true },
    { $inc: { views: 1 } },
    { new: true }
  ).populate('author', 'firstName lastName avatar role');

  // If not found as published, check if requester is the author
  if (!blog && req.user) {
    blog = await BlogPost.findOne(query).populate('author', 'firstName lastName avatar role');
    if (blog && blog.author._id.toString() !== req.user._id.toString()) {
      blog = null;
    }
  }

  if (!blog) return next(new AppError('Blog maqolasi topilmadi.', 404));

  const obj = blog.toObject();
  obj.likesCount = obj.likes ? obj.likes.length : 0;
  obj.isLiked = req.user
    ? (obj.likes || []).some(id => id.toString() === req.user._id.toString())
    : false;

  res.status(200).json({ success: true, data: obj });
});

/* ── User CRUD ───────────────────────────────────────────────────────────── */

// POST /api/v1/blogs
exports.createUserBlog = catchAsync(async (req, res) => {
  if (req.file) req.body.coverImage = req.file.path;
  if (req.body.tags && typeof req.body.tags === 'string') {
    req.body.tags = req.body.tags.split(',').map(t => t.trim()).filter(Boolean);
  }
  const blog = await BlogPost.create({ ...req.body, author: req.user._id });
  res.status(201).json({ success: true, data: blog });
});

// PATCH /api/v1/blogs/:id  (author only)
exports.updateUserBlog = catchAsync(async (req, res, next) => {
  const blog = await BlogPost.findById(req.params.id);
  if (!blog) return next(new AppError('Blog maqolasi topilmadi.', 404));
  if (blog.author.toString() !== req.user._id.toString()) {
    return next(new AppError('Siz bu maqolani tahrirlash huquqiga ega emassiz.', 403));
  }
  if (req.file) req.body.coverImage = req.file.path;
  if (req.body.tags && typeof req.body.tags === 'string') {
    req.body.tags = req.body.tags.split(',').map(t => t.trim()).filter(Boolean);
  }
  const updated = await BlogPost.findByIdAndUpdate(req.params.id, req.body, {
    new: true, runValidators: true,
  });
  res.status(200).json({ success: true, data: updated });
});

// DELETE /api/v1/blogs/:id  (author only)
exports.deleteUserBlog = catchAsync(async (req, res, next) => {
  const blog = await BlogPost.findById(req.params.id);
  if (!blog) return next(new AppError('Blog maqolasi topilmadi.', 404));
  if (blog.author.toString() !== req.user._id.toString()) {
    return next(new AppError('Siz bu maqolani o\'chirish huquqiga ega emassiz.', 403));
  }
  await blog.deleteOne();
  res.status(204).json({ success: true, data: null });
});

// POST /api/v1/blogs/:id/like  (toggle)
exports.likeBlog = catchAsync(async (req, res, next) => {
  const blog = await BlogPost.findById(req.params.id);
  if (!blog) return next(new AppError('Blog maqolasi topilmadi.', 404));

  const uid = req.user._id.toString();
  const already = blog.likes.some(l => l.toString() === uid);

  if (already) {
    blog.likes = blog.likes.filter(l => l.toString() !== uid);
  } else {
    blog.likes.push(req.user._id);
  }
  await blog.save({ validateBeforeSave: false });

  res.status(200).json({ success: true, liked: !already, likesCount: blog.likes.length });
});

/* ── Admin ───────────────────────────────────────────────────────────────── */

exports.adminGetAllBlogs = catchAsync(async (req, res) => {
  const features = new APIFeatures(
    BlogPost.find().populate('author', 'firstName lastName avatar'),
    req.query
  ).filter().search(['title', 'excerpt']).sort().paginate();

  const [blogs, total] = await Promise.all([features.query, BlogPost.countDocuments()]);

  const data = blogs.map(b => {
    const obj = b.toObject();
    obj.likesCount = obj.likes ? obj.likes.length : 0;
    return obj;
  });

  res.status(200).json({ success: true, results: data.length, total, data });
});

exports.createBlog = catchAsync(async (req, res) => {
  if (req.file) req.body.coverImage = req.file.path;
  if (req.body.tags && typeof req.body.tags === 'string') {
    req.body.tags = req.body.tags.split(',').map(t => t.trim()).filter(Boolean);
  }
  const blog = await BlogPost.create({ ...req.body, author: req.user._id });
  res.status(201).json({ success: true, data: blog });
});

exports.updateBlog = catchAsync(async (req, res, next) => {
  if (req.file) req.body.coverImage = req.file.path;
  if (req.body.tags && typeof req.body.tags === 'string') {
    req.body.tags = req.body.tags.split(',').map(t => t.trim()).filter(Boolean);
  }
  const blog = await BlogPost.findByIdAndUpdate(req.params.id, req.body, {
    new: true, runValidators: true,
  });
  if (!blog) return next(new AppError('Blog maqolasi topilmadi.', 404));
  res.status(200).json({ success: true, data: blog });
});

exports.deleteBlog = catchAsync(async (req, res, next) => {
  const blog = await BlogPost.findByIdAndDelete(req.params.id);
  if (!blog) return next(new AppError('Blog maqolasi topilmadi.', 404));
  res.status(204).json({ success: true, data: null });
});
