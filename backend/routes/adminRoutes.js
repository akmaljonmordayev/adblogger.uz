const express = require('express');
const router = express.Router();
const { protect, restrictTo } = require('../middleware/auth');

const adminController    = require('../controllers/adminController');
const profileController  = require('../controllers/profileController');
const bloggerController  = require('../controllers/bloggerController');
const adController       = require('../controllers/adController');
const blogController     = require('../controllers/blogController');
const categoryController = require('../controllers/categoryController');
const faqController      = require('../controllers/faqController');
const careerController   = require('../controllers/careerController');
const contactController  = require('../controllers/contactController');
const campaignController = require('../controllers/campaignController');
const { uploadBlogImage } = require('../config/cloudinary');

router.use(protect, restrictTo('admin'));

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin panel (faqat admin uchun)
 */

/**
 * @swagger
 * /admin/dashboard:
 *   get:
 *     summary: Dashboard statistikasi
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Statistika ma'lumotlari
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data:
 *                   type: object
 *                   properties:
 *                     stats:
 *                       type: object
 *                       properties:
 *                         totalUsers:          { type: number }
 *                         totalBloggers:       { type: number }
 *                         totalAds:            { type: number }
 *                         totalBlogs:          { type: number }
 *                         pendingAds:          { type: number }
 *                         newContacts:         { type: number }
 *                         completedCampaigns:  { type: number }
 */
router.get('/dashboard', adminController.getDashboardStats);

// ── Users ──────────────────────────────────────────────────────────────────────
/**
 * @swagger
 * /admin/users:
 *   get:
 *     summary: Barcha foydalanuvchilar
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [user, blogger, business]
 *       - in: query
 *         name: isActive
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: Foydalanuvchilar ro'yxati
 */
router.get('/users',        profileController.adminGetAllUsers);
router.get('/users/:id',    profileController.adminGetUser);
router.patch('/users/:id',  profileController.adminUpdateUser);
router.delete('/users/:id', profileController.adminDeleteUser);

// ── Bloggers ───────────────────────────────────────────────────────────────────
/**
 * @swagger
 * /admin/bloggers:
 *   get:
 *     summary: Barcha bloggerlar (admin)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Bloggerlar ro'yxati
 */
/**
 * @swagger
 * /admin/bloggers/{id}/verify:
 *   patch:
 *     summary: Bloggerni tasdiqlash / bekor qilish
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               isVerified: { type: boolean }
 *     responses:
 *       200:
 *         description: Blogger holati yangilandi
 */
router.get('/bloggers', bloggerController.adminGetAllBloggers);
router.patch('/bloggers/:id/verify', bloggerController.verifyBlogger);

// ── Ads ────────────────────────────────────────────────────────────────────────
/**
 * @swagger
 * /admin/ads:
 *   get:
 *     summary: Barcha e'lonlar (admin)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: E'lonlar ro'yxati
 */
/**
 * @swagger
 * /admin/ads/{id}/status:
 *   patch:
 *     summary: E'lon statusini o'zgartirish
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, approved, rejected, active, completed]
 *     responses:
 *       200:
 *         description: Status yangilandi
 */
router.get('/ads', adController.adminGetAllAds);
router.patch('/ads/:id/status', adController.changeAdStatus);

// ── Blogs ──────────────────────────────────────────────────────────────────────
/**
 * @swagger
 * /admin/blogs:
 *   get:
 *     summary: Barcha blog maqolalari (admin)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Blog maqolalari
 *   post:
 *     summary: Yangi blog maqolasi yaratish
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [title, content, category]
 *             properties:
 *               title:       { type: string }
 *               excerpt:     { type: string }
 *               content:     { type: string }
 *               category:    { type: string }
 *               tags:        { type: string }
 *               isPublished: { type: boolean }
 *               coverImage:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Maqola yaratildi
 */
/**
 * @swagger
 * /admin/blogs/{id}:
 *   patch:
 *     summary: Blog maqolasini tahrirlash
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Maqola yangilandi
 *   delete:
 *     summary: Blog maqolasini o'chirish
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Maqola o'chirildi
 */
router.get('/blogs', blogController.adminGetAllBlogs);
router.post('/blogs', uploadBlogImage.single('coverImage'), blogController.createBlog);
router.patch('/blogs/:id', uploadBlogImage.single('coverImage'), blogController.updateBlog);
router.delete('/blogs/:id', blogController.deleteBlog);

// ── Categories ─────────────────────────────────────────────────────────────────
router.get('/categories',       categoryController.getAllCategories);
router.post('/categories',      categoryController.createCategory);
router.patch('/categories/:id', categoryController.updateCategory);
router.delete('/categories/:id',categoryController.deleteCategory);

// ── FAQs ───────────────────────────────────────────────────────────────────────
router.get('/faqs',        faqController.adminGetAllFAQs);
router.post('/faqs',       faqController.createFAQ);
router.patch('/faqs/:id',  faqController.updateFAQ);
router.delete('/faqs/:id', faqController.deleteFAQ);

// ── Careers ────────────────────────────────────────────────────────────────────
router.get('/careers',         careerController.adminGetAllCareers);
router.post('/careers',        careerController.createCareer);
router.patch('/careers/:id',   careerController.updateCareer);
router.delete('/careers/:id',  careerController.deleteCareer);

// ── Contacts ───────────────────────────────────────────────────────────────────
/**
 * @swagger
 * /admin/contacts:
 *   get:
 *     summary: Barcha bog'lanish xabarlari
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [new, read, responded]
 *     responses:
 *       200:
 *         description: Xabarlar ro'yxati
 */
router.get('/contacts',              contactController.getAllContacts);
router.get('/contacts/:id',          contactController.getContact);
router.patch('/contacts/:id/status', contactController.updateContactStatus);
router.delete('/contacts/:id',       contactController.deleteContact);

// ── Campaigns ──────────────────────────────────────────────────────────────────
router.get('/campaigns', campaignController.adminGetAllCampaigns);

module.exports = router;
