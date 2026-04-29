const express = require('express');
const router = express.Router();
const ac = require('../controllers/adController');
const { protect } = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Ads
 *   description: E'lonlar (blogger va biznes)
 */

/**
 * @swagger
 * /ads:
 *   get:
 *     summary: Barcha e'lonlar
 *     tags: [Ads]
 *     security: []
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [blogger, business]
 *         description: E'lon turi
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
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
 *           example: -createdAt
 *     responses:
 *       200:
 *         description: E'lonlar ro'yxati
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/PaginatedResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Ad'
 */
router.get('/', ac.getAllAds);

/**
 * @swagger
 * /ads/user/my-ads:
 *   get:
 *     summary: Mening e'lonlarim
 *     tags: [Ads]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: E'lonlar ro'yxati
 */
// Must be before /:id to avoid wildcard capture
router.get('/user/my-ads', protect, ac.getMyAds);

/**
 * @swagger
 * /ads/{id}:
 *   get:
 *     summary: E'lon tafsilotlari
 *     tags: [Ads]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: E'lon ma'lumotlari
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Ad'
 *       404:
 *         description: E'lon topilmadi
 */
router.get('/:id', ac.getAd);

/**
 * @swagger
 * /ads:
 *   post:
 *     summary: Yangi e'lon joylash
 *     tags: [Ads]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [type]
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [blogger, business]
 *               title:
 *                 type: string
 *                 example: Instagram post reklamasi
 *               description:
 *                 type: string
 *               platforms:
 *                 type: array
 *                 items:
 *                   type: string
 *               pricing:
 *                 type: object
 *                 properties:
 *                   post:  { type: number }
 *                   story: { type: number }
 *                   video: { type: number }
 *               companyName:
 *                 type: string
 *               budget:
 *                 type: object
 *                 properties:
 *                   range: { type: string }
 *               phone:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       201:
 *         description: E'lon yaratildi (pending holatda)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Ad'
 */
router.post('/', protect, ac.createAd);

/**
 * @swagger
 * /ads/{id}:
 *   patch:
 *     summary: E'lonni tahrirlash
 *     tags: [Ads]
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
 *             $ref: '#/components/schemas/Ad'
 *     responses:
 *       200:
 *         description: E'lon yangilandi
 *   delete:
 *     summary: E'lonni o'chirish
 *     tags: [Ads]
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
 *         description: E'lon o'chirildi
 */
router.patch('/:id', protect, ac.updateAd);
router.delete('/:id', protect, ac.deleteAd);

module.exports = router;
