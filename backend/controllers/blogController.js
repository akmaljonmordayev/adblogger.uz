const BlogPost = require('../models/BlogPost');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');

/* ── helpers ─────────────────────────────────────────────────────────────── */
function serializeBlog(blog, userId) {
  const obj = blog.toObject ? blog.toObject() : blog;
  obj.likesCount    = Array.isArray(obj.likes)    ? obj.likes.length    : 0;
  obj.commentsCount = Array.isArray(obj.comments) ? obj.comments.length : 0;
  obj.isLiked = userId
    ? (obj.likes || []).some(id => id.toString() === userId.toString())
    : false;
  delete obj.likes;   // never expose the full array in list
  return obj;
}

/* ── Public ─────────────────────────────────────────────────────────────── */

// GET /api/v1/blogs
exports.getAllBlogs = catchAsync(async (req, res) => {
  const filter = { isPublished: true, status: 'approved' };
  if (req.query.category) filter.category = req.query.category;

  const features = new APIFeatures(
    BlogPost.find(filter)
      .populate('author', 'firstName lastName avatar')
      .select('-comments -content'),   // keep list payload light
    req.query
  )
    .search(['title', 'excerpt', 'tags'])
    .sort()
    .limitFields()
    .paginate();

  const [blogs, total] = await Promise.all([
    features.query,
    BlogPost.countDocuments(filter),
  ]);

  const uid  = req.user?._id;
  const data = blogs.map(b => serializeBlog(b, uid));

  res.status(200).json({
    success: true,
    results: data.length,
    total,
    totalPages: Math.ceil(total / (features.limit || 20)),
    page: features.page,
    data,
  });
});

// GET /api/v1/blogs/my  ← must be registered BEFORE /:slugOrId
exports.getMyBlogs = catchAsync(async (req, res) => {
  const blogs = await BlogPost.find({ author: req.user._id })
    .sort('-createdAt')
    .select('-comments')
    .populate('author', 'firstName lastName avatar');

  const data = blogs.map(b => {
    const obj = b.toObject();
    obj.likesCount    = obj.likes?.length    || 0;
    obj.commentsCount = obj.comments?.length || 0;
    delete obj.likes;
    return obj;
  });
  res.status(200).json({ success: true, results: data.length, data });
});

// GET /api/v1/blogs/:slugOrId
exports.getBlog = catchAsync(async (req, res, next) => {
  const query = req.params.slugOrId.match(/^[0-9a-fA-F]{24}$/)
    ? { _id: req.params.slugOrId }
    : { slug: req.params.slugOrId };

  let blog = await BlogPost.findOneAndUpdate(
    { ...query, isPublished: true },
    { $inc: { views: 1 } },
    { new: true }
  )
    .populate('author', 'firstName lastName avatar role')
    .populate('comments.user', 'firstName lastName avatar');

  if (!blog && req.user) {
    blog = await BlogPost.findOne(query)
      .populate('author', 'firstName lastName avatar role')
      .populate('comments.user', 'firstName lastName avatar');
    if (blog && blog.author._id.toString() !== req.user._id.toString()) {
      blog = null;
    }
  }

  if (!blog) return next(new AppError('Blog maqolasi topilmadi.', 404));

  const obj = blog.toObject();
  obj.likesCount    = obj.likes?.length    || 0;
  obj.commentsCount = obj.comments?.length || 0;
  obj.isLiked = req.user
    ? (obj.likes || []).some(id => id.toString() === req.user._id.toString())
    : false;
  delete obj.likes;

  // enrich comments with likesCount
  obj.comments = (obj.comments || []).map(c => ({
    ...c,
    likesCount: c.likes?.length || 0,
    isLiked: req.user ? (c.likes || []).some(id => id.toString() === req.user._id.toString()) : false,
  }));

  res.status(200).json({ success: true, data: obj });
});

/* ── Like / Unlike ───────────────────────────────────────────────────────── */

// POST /api/v1/blogs/:id/like
exports.likeBlog = catchAsync(async (req, res, next) => {
  const blog = await BlogPost.findById(req.params.id);
  if (!blog) return next(new AppError('Blog maqolasi topilmadi.', 404));

  const uid     = req.user._id.toString();
  const already = blog.likes.some(l => l.toString() === uid);

  if (already) {
    blog.likes = blog.likes.filter(l => l.toString() !== uid);
  } else {
    blog.likes.push(req.user._id);
  }
  await blog.save({ validateBeforeSave: false });

  res.status(200).json({ success: true, liked: !already, likesCount: blog.likes.length });
});

/* ── Comments ─────────────────────────────────────────────────────────────── */

// POST /api/v1/blogs/:id/comments
exports.addComment = catchAsync(async (req, res, next) => {
  const blog = await BlogPost.findById(req.params.id);
  if (!blog) return next(new AppError('Blog maqolasi topilmadi.', 404));
  if (!blog.isPublished) return next(new AppError('Bu blog hali nashr etilmagan.', 403));

  const { text } = req.body;
  if (!text || !text.trim()) return next(new AppError('Izoh matni kiritilishi shart.', 400));

  blog.comments.push({ user: req.user._id, text: text.trim() });
  await blog.save({ validateBeforeSave: false });

  await blog.populate('comments.user', 'firstName lastName avatar');

  const newComment = blog.comments[blog.comments.length - 1].toObject();
  newComment.likesCount = 0;
  newComment.isLiked    = false;

  res.status(201).json({ success: true, data: newComment, commentsCount: blog.comments.length });
});

// DELETE /api/v1/blogs/:id/comments/:commentId
exports.deleteComment = catchAsync(async (req, res, next) => {
  const blog = await BlogPost.findById(req.params.id);
  if (!blog) return next(new AppError('Blog maqolasi topilmadi.', 404));

  const comment = blog.comments.id(req.params.commentId);
  if (!comment) return next(new AppError('Izoh topilmadi.', 404));

  const isOwner  = comment.user.toString() === req.user._id.toString();
  const isAuthor = blog.author.toString()  === req.user._id.toString();
  const isAdmin  = req.user.role === 'admin';

  if (!isOwner && !isAuthor && !isAdmin) {
    return next(new AppError('Siz bu izohni o\'chirish huquqiga ega emassiz.', 403));
  }

  comment.deleteOne();
  await blog.save({ validateBeforeSave: false });

  res.status(200).json({ success: true, commentsCount: blog.comments.length });
});

// POST /api/v1/blogs/:id/comments/:commentId/like
exports.likeComment = catchAsync(async (req, res, next) => {
  const blog = await BlogPost.findById(req.params.id);
  if (!blog) return next(new AppError('Blog maqolasi topilmadi.', 404));

  const comment = blog.comments.id(req.params.commentId);
  if (!comment) return next(new AppError('Izoh topilmadi.', 404));

  const uid     = req.user._id.toString();
  const already = comment.likes.some(l => l.toString() === uid);

  if (already) {
    comment.likes = comment.likes.filter(l => l.toString() !== uid);
  } else {
    comment.likes.push(req.user._id);
  }
  await blog.save({ validateBeforeSave: false });

  res.status(200).json({ success: true, liked: !already, likesCount: comment.likes.length });
});

/* ── User CRUD ───────────────────────────────────────────────────────────── */

// POST /api/v1/blogs
exports.createUserBlog = catchAsync(async (req, res) => {
  if (req.file) req.body.coverImage = req.file.path;
  if (req.body.tags && typeof req.body.tags === 'string') {
    req.body.tags = req.body.tags.split(',').map(t => t.trim()).filter(Boolean);
  }
  // User-created blogs require admin approval
  req.body.isPublished = false;
  req.body.status = 'pending';
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

/* ── Admin ───────────────────────────────────────────────────────────────── */

exports.adminGetAllBlogs = catchAsync(async (req, res) => {
  const filter = {};
  if (req.query.status) filter.status = req.query.status;

  const features = new APIFeatures(
    BlogPost.find(filter).populate('author', 'firstName lastName avatar role'),
    req.query
  ).search(['title', 'excerpt']).sort().paginate();

  const [blogs, total] = await Promise.all([
    features.query,
    BlogPost.countDocuments(filter),
  ]);

  // counts per status
  const [pendingCount, approvedCount, rejectedCount] = await Promise.all([
    BlogPost.countDocuments({ status: 'pending' }),
    BlogPost.countDocuments({ status: 'approved' }),
    BlogPost.countDocuments({ status: 'rejected' }),
  ]);

  const data = blogs.map(b => serializeBlog(b, req.user?._id));

  res.status(200).json({
    success: true,
    results: data.length,
    total,
    totalPages: Math.ceil(total / (features.limit || 20)),
    page: features.page,
    counts: { all: pendingCount + approvedCount + rejectedCount, pending: pendingCount, approved: approvedCount, rejected: rejectedCount },
    data,
  });
});

// PATCH /api/v1/blogs/admin/:id/status  — approve or reject
exports.updateBlogStatus = catchAsync(async (req, res, next) => {
  const { status } = req.body;
  if (!['approved', 'rejected', 'pending'].includes(status)) {
    return next(new AppError('Noto\'g\'ri status.', 400));
  }
  const blog = await BlogPost.findByIdAndUpdate(
    req.params.id,
    {
      status,
      isPublished: status === 'approved',
    },
    { new: true, runValidators: false }
  ).populate('author', 'firstName lastName avatar');

  if (!blog) return next(new AppError('Blog topilmadi.', 404));
  res.status(200).json({ success: true, data: blog });
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
