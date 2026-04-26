const express = require('express');
const router  = express.Router();
const bc      = require('../controllers/businessController');
const { protect, restrictTo } = require('../middleware/auth');

router.use(protect, restrictTo('business'));

/**
 * @swagger
 * tags:
 *   name: Business
 *   description: Biznes profili
 */

/**
 * @swagger
 * /business/me:
 *   get:
 *     summary: Mening biznes profilim
 *     tags: [Business]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Biznes profili
 */
router.get('/me', bc.getMyProfile);

/**
 * @swagger
 * /business/me:
 *   patch:
 *     summary: Biznes profilini yangilash
 *     tags: [Business]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               companyName:     { type: string }
 *               companyType:     { type: string }
 *               description:     { type: string }
 *               website:         { type: string }
 *               location:        { type: string }
 *               targetPlatforms: { type: array, items: { type: string } }
 *               targetNiches:    { type: array, items: { type: string } }
 *               budgetRange:     { type: string }
 *     responses:
 *       200:
 *         description: Profil yangilandi
 */
router.patch('/me', bc.updateMyProfile);

module.exports = router;
