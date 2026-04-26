const express = require('express');
const router = express.Router();
const cc = require('../controllers/contactController');

/**
 * @swagger
 * tags:
 *   name: Contact
 *   description: Bog'lanish
 */

/**
 * @swagger
 * /contact:
 *   post:
 *     summary: Xabar yuborish
 *     tags: [Contact]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ContactInput'
 *     responses:
 *       201:
 *         description: Xabar qabul qilindi
 *       400:
 *         description: Noto'g'ri ma'lumot
 */
router.post('/', cc.sendContact);

module.exports = router;
