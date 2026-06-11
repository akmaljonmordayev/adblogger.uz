const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/siteReviewController');
const { protect } = require('../middleware/auth');

router.get('/',    ctrl.getReviews);
router.get('/my',  protect, ctrl.getMyReview);
router.post('/',   protect, ctrl.createReview);
router.put('/my',  protect, ctrl.updateMyReview);

module.exports = router;
