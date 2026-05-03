const express = require('express');
const router  = express.Router();
const bc      = require('../controllers/blogController');
const { protect, optionalAuth, restrictTo } = require('../middleware/auth');
const { uploadBlogImage } = require('../config/cloudinary');
const upload = uploadBlogImage;

/* ── Public ───────────────────────────────────────────────────────────────── */

// GET /api/v1/blogs  — list published blogs (search, sort, filter, paginate)
router.get('/', optionalAuth, bc.getAllBlogs);

/* ── User protected ───────────────────────────────────────────────────────── */

// GET /api/v1/blogs/my — must come BEFORE /:slugOrId
router.get('/my', protect, bc.getMyBlogs);

// POST /api/v1/blogs — create blog
router.post('/', protect, upload.single('coverImage'), bc.createUserBlog);

/* ── Single blog (public + optional auth for isLiked) ──────────────────── */

// GET /api/v1/blogs/:slugOrId
router.get('/:slugOrId', optionalAuth, bc.getBlog);

/* ── Blog actions ──────────────────────────────────────────────────────── */

// PATCH  /api/v1/blogs/:id — update own blog
router.patch('/:id', protect, upload.single('coverImage'), bc.updateUserBlog);

// DELETE /api/v1/blogs/:id — delete own blog
router.delete('/:id', protect, bc.deleteUserBlog);

// POST /api/v1/blogs/:id/like — toggle like
router.post('/:id/like', protect, bc.likeBlog);

/* ── Comments ─────────────────────────────────────────────────────────────── */

// POST   /api/v1/blogs/:id/comments — add comment
router.post('/:id/comments', protect, bc.addComment);

// DELETE /api/v1/blogs/:id/comments/:commentId — delete comment
router.delete('/:id/comments/:commentId', protect, bc.deleteComment);

// POST /api/v1/blogs/:id/comments/:commentId/like — like a comment
router.post('/:id/comments/:commentId/like', protect, bc.likeComment);

/* ── Admin ─────────────────────────────────────────────────────────────────── */

router.get('/admin/all', protect, restrictTo('admin'), bc.adminGetAllBlogs);
router.post('/admin', protect, restrictTo('admin'), upload.single('coverImage'), bc.createBlog);
router.patch('/admin/:id/status', protect, restrictTo('admin'), bc.updateBlogStatus);
router.patch('/admin/:id', protect, restrictTo('admin'), upload.single('coverImage'), bc.updateBlog);
router.delete('/admin/:id', protect, restrictTo('admin'), bc.deleteBlog);

module.exports = router;
