const express = require('express');
const router = express.Router();
const fc = require('../controllers/faqController');

/**
 * @swagger
 * tags:
 *   name: FAQ
 *   description: Ko'p so'raladigan savollar
 */

/**
 * @swagger
 * /faqs:
 *   get:
 *     summary: FAQlar ro'yxati
 *     tags: [FAQ]
 *     security: []
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum: [general, blogger, business, payment, technical]
 *     responses:
 *       200:
 *         description: FAQlar ro'yxati
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/FAQ'
 */
router.get('/', fc.getAllFAQs);

module.exports = router;
