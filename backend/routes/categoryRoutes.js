const express = require('express');
const router = express.Router();
const cc = require('../controllers/categoryController');

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Kategoriyalar
 */

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Barcha kategoriyalar
 *     tags: [Categories]
 *     security: []
 *     responses:
 *       200:
 *         description: Kategoriyalar ro'yxati
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:  { type: boolean }
 *                 results:  { type: number }
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Category'
 */
router.get('/', cc.getAllCategories);

/**
 * @swagger
 * /categories/{id}:
 *   get:
 *     summary: Kategoriya tafsilotlari
 *     tags: [Categories]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Kategoriya ma'lumotlari
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 */
router.get('/:id', cc.getCategory);

module.exports = router;
