const express = require('express');
const router = express.Router();

router.use('/auth',      require('./authRoutes'));
router.use('/bloggers',  require('./bloggerRoutes'));
router.use('/ads',       require('./adRoutes'));
router.use('/blogs',     require('./blogRoutes'));
router.use('/categories',require('./categoryRoutes'));
router.use('/campaigns', require('./campaignRoutes'));
router.use('/contact',   require('./contactRoutes'));
router.use('/faqs',      require('./faqRoutes'));
router.use('/careers',   require('./careerRoutes'));
router.use('/profile',   require('./profileRoutes'));
router.use('/business',  require('./businessRoutes'));
router.use('/admin',     require('./adminRoutes'));

// Nested reviews under bloggers
router.use('/bloggers/:bloggerId/reviews', require('./reviewRoutes'));

module.exports = router;
