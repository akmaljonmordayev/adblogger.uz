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
const campaignController  = require('../controllers/campaignController');
const businessController  = require('../controllers/businessController');
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
 */
router.get('/dashboard', adminController.getDashboardStats);
router.get('/statistics', adminController.getStatistics);

// ── Applications (Registration Approvals) ──────────────────────────────────────
router.get('/applications',                        adminController.getPendingApplications);
router.patch('/applications/:id/approve',           adminController.approveApplication);
router.patch('/applications/:id/reject',            adminController.rejectApplication);
router.patch('/applications/:id/approve-profile',   adminController.approveProfile);
router.patch('/applications/:id/reject-profile',    adminController.rejectProfile);

// ── Users ──────────────────────────────────────────────────────────────────────
router.get('/users',        profileController.adminGetAllUsers);
router.get('/users/:id',    profileController.adminGetUser);
router.patch('/users/:id',  profileController.adminUpdateUser);
router.delete('/users/:id', profileController.adminDeleteUser);

// ── Bloggers ───────────────────────────────────────────────────────────────────
router.get('/bloggers', bloggerController.adminGetAllBloggers);
router.patch('/bloggers/:id/verify', bloggerController.verifyBlogger);
router.patch('/bloggers/:id/block', bloggerController.blockBlogger);
router.patch('/bloggers/:id/freeze', bloggerController.freezeBlogger);
router.delete('/bloggers/:id', bloggerController.adminDeleteBlogger);

// ── Ads ────────────────────────────────────────────────────────────────────────
router.get('/ads', adController.adminGetAllAds);
router.patch('/ads/:id/status', adController.changeAdStatus);
router.delete('/ads/:id', adController.adminDeleteAd);

// ── Blogs ──────────────────────────────────────────────────────────────────────
router.get('/blogs', blogController.adminGetAllBlogs);
router.post('/blogs', uploadBlogImage.single('coverImage'), blogController.createBlog);
router.patch('/blogs/:id', uploadBlogImage.single('coverImage'), blogController.updateBlog);
router.delete('/blogs/:id', blogController.deleteBlog);

// ── Categories ─────────────────────────────────────────────────────────────────
router.get('/categories',              categoryController.getAllCategories);
router.post('/categories/sync-counts', categoryController.syncAllBloggerCounts);
router.post('/categories',             categoryController.createCategory);
router.patch('/categories/:id',        categoryController.updateCategory);
router.delete('/categories/:id',       categoryController.deleteCategory);

// ── FAQs ───────────────────────────────────────────────────────────────────────
router.get('/faqs',        faqController.adminGetAllFAQs);
router.post('/faqs',       faqController.createFAQ);
router.patch('/faqs/:id',  faqController.updateFAQ);
router.delete('/faqs/:id', faqController.deleteFAQ);

// ── Careers ────────────────────────────────────────────────────────────────────
router.get('/careers',                                  careerController.adminGetAllCareers);
router.post('/careers',                                 careerController.createCareer);
router.patch('/careers/:id',                            careerController.updateCareer);
router.delete('/careers/:id',                           careerController.deleteCareer);
router.get('/careers/:id/applications',                 careerController.getApplications);
router.get('/career-applications',                      careerController.getAllApplications);
router.patch('/career-applications/:appId/status',      careerController.updateApplicationStatus);
router.delete('/career-applications/:appId',            careerController.deleteApplication);

// ── Contacts ───────────────────────────────────────────────────────────────────
router.get('/contacts',              contactController.getAllContacts);
router.get('/contacts/:id',          contactController.getContact);
router.patch('/contacts/:id/status', contactController.updateContactStatus);
router.patch('/contacts/:id/reply',  contactController.replyContact);
router.delete('/contacts/:id',       contactController.deleteContact);

// ── Campaigns ──────────────────────────────────────────────────────────────────
router.get('/campaigns', campaignController.adminGetAllCampaigns);

// ── Businesses ─────────────────────────────────────────────────────────────────
router.get('/businesses', businessController.adminGetAll);

module.exports = router;
