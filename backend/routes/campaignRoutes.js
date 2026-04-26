const express = require('express');
const router = express.Router();
const cc = require('../controllers/campaignController');
const { protect } = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Campaigns
 *   description: Kampaniyalar va buyurtmalar
 */

/**
 * @swagger
 * /campaigns/my:
 *   get:
 *     summary: Mening kampaniyalarim
 *     tags: [Campaigns]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Kampaniyalar ro'yxati
 */
/**
 * @swagger
 * /campaigns:
 *   post:
 *     summary: Yangi kampaniya (taklif yuborish)
 *     tags: [Campaigns]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [bloggerId]
 *             properties:
 *               bloggerId:    { type: string }
 *               adId:         { type: string }
 *               agreedPrice:  { type: number }
 *               startDate:    { type: string, format: date }
 *               endDate:      { type: string, format: date }
 *               deliverables: { type: string }
 *               notes:        { type: string }
 *     responses:
 *       201:
 *         description: Kampaniya yaratildi
 */
/**
 * @swagger
 * /campaigns/{id}:
 *   get:
 *     summary: Kampaniya tafsilotlari
 *     tags: [Campaigns]
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
 *         description: Kampaniya ma'lumotlari
 */
/**
 * @swagger
 * /campaigns/{id}/status:
 *   patch:
 *     summary: Kampaniya statusini o'zgartirish
 *     tags: [Campaigns]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [proposal, negotiating, agreed, in_progress, completed, cancelled]
 *     responses:
 *       200:
 *         description: Status yangilandi
 */

router.use(protect);
router.get('/my', cc.getMyCampaigns);
router.post('/', cc.createCampaign);
router.get('/:id', cc.getCampaign);
router.patch('/:id/status', cc.updateCampaignStatus);

module.exports = router;
