const express = require('express');
const router = express.Router();
const bc = require('../controllers/bloggerController');
const { protect, restrictTo } = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Bloggers
 *   description: Bloggerlar boshqaruvi
 */

/**
 * @swagger
 * /bloggers:
 *   get:
 *     summary: Barcha bloggerlar ro'yxati
 *     tags: [Bloggers]
 *     security: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: categories
 *         schema:
 *           type: string
 *       - in: query
 *         name: platforms
 *         schema:
 *           type: string
 *       - in: query
 *         name: isVerified
 *         schema:
 *           type: boolean
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           example: -rating
 *     responses:
 *       200:
 *         description: Bloggerlar ro'yxati
 */
router.get('/', bc.getAllBloggers);

// Protected blogger-only routes — MUST come before /:id to avoid shadowing
/**
 * @swagger
 * /bloggers/me/profile:
 *   get:
 *     summary: Mening blogger profilim
 *     tags: [Bloggers]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Blogger profili
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Blogger'
 */
router.get('/me/profile',   protect, restrictTo('blogger'), bc.getMyProfile);

/**
 * @swagger
 * /bloggers/me/profile:
 *   patch:
 *     summary: Blogger profilini yangilash
 *     tags: [Bloggers]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               handle:         { type: string }
 *               bio:            { type: string }
 *               platforms:      { type: array, items: { type: string } }
 *               categories:     { type: array, items: { type: string } }
 *               followers:      { type: number }
 *               engagementRate: { type: number }
 *               pricing:
 *                 type: object
 *     responses:
 *       200:
 *         description: Profil yangilandi
 */
router.patch('/me/profile', protect, restrictTo('blogger'), bc.updateMyProfile);

/**
 * @swagger
 * /bloggers/{id}:
 *   get:
 *     summary: Blogger profili (public)
 *     tags: [Bloggers]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Blogger ma'lumotlari
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Blogger'
 *       404:
 *         description: Blogger topilmadi
 */
router.get('/:id', bc.getBlogger);

module.exports = router;
