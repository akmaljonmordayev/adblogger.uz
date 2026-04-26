const express = require('express');
const router = express.Router({ mergeParams: true });
const rc = require('../controllers/reviewController');
const { protect } = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Reviews
 *   description: Blogger sharhlari
 */

/**
 * @swagger
 * /bloggers/{bloggerId}/reviews:
 *   get:
 *     summary: Blogger sharhlari
 *     tags: [Reviews]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: bloggerId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Sharhlar ro'yxati
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Review'
 *   post:
 *     summary: Sharh yozish
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bloggerId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [rating]
 *             properties:
 *               rating:  { type: number, minimum: 1, maximum: 5 }
 *               comment: { type: string }
 *     responses:
 *       201:
 *         description: Sharh qo'shildi
 */

router.get('/', rc.getBloggerReviews);
router.post('/', protect, rc.createReview);
router.delete('/:id', protect, rc.deleteReview);

module.exports = router;
