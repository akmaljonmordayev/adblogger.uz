const express = require('express');
const router = express.Router({ mergeParams: true });
const rc = require('../controllers/reviewController');
const { protect } = require('../middleware/auth');

router.get('/',          rc.getBloggerReviews);
router.post('/',         protect, rc.createReview);
router.patch('/:id',     protect, rc.updateReview);
router.delete('/:id',    protect, rc.deleteReview);
router.post('/:id/like', protect, rc.toggleLike);

module.exports = router;
