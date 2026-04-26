const express = require('express');
const router = express.Router();
const cc = require('../controllers/careerController');

/**
 * @swagger
 * tags:
 *   name: Careers
 *   description: Vakansiyalar
 */

/**
 * @swagger
 * /careers:
 *   get:
 *     summary: Barcha vakansiyalar
 *     tags: [Careers]
 *     security: []
 *     responses:
 *       200:
 *         description: Vakansiyalar ro'yxati
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Career'
 */
router.get('/', cc.getAllCareers);

/**
 * @swagger
 * /careers/{id}:
 *   get:
 *     summary: Vakansiya tafsilotlari
 *     tags: [Careers]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Vakansiya ma'lumotlari
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Career'
 *       404:
 *         description: Vakansiya topilmadi
 */
router.get('/:id', cc.getCareer);

module.exports = router;
