const express = require('express');
const router = express.Router();
const bc = require('../controllers/blogController');

/**
 * @swagger
 * tags:
 *   name: Blogs
 *   description: Blog maqolalari
 */

/**
 * @swagger
 * /blogs:
 *   get:
 *     summary: Blog maqolalari ro'yxati
 *     tags: [Blogs]
 *     security: []
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum: [Tech, Lifestyle, Beauty, Food, Sports, Travel, Education, Business, Gaming, Music]
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
 *     responses:
 *       200:
 *         description: Blog maqolalari
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
 *                         $ref: '#/components/schemas/BlogPost'
 */
router.get('/', bc.getAllBlogs);

/**
 * @swagger
 * /blogs/{slugOrId}:
 *   get:
 *     summary: Blog maqolasi tafsilotlari
 *     tags: [Blogs]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: slugOrId
 *         required: true
 *         schema:
 *           type: string
 *         description: Blog slug yoki MongoDB ID
 *     responses:
 *       200:
 *         description: Blog maqolasi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BlogPost'
 *       404:
 *         description: Maqola topilmadi
 */
router.get('/:slugOrId', bc.getBlog);

module.exports = router;
