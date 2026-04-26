const express = require('express');
const router = express.Router();
const pc = require('../controllers/profileController');
const { protect } = require('../middleware/auth');
const { uploadAvatar } = require('../config/cloudinary');

/**
 * @swagger
 * tags:
 *   name: Profile
 *   description: Foydalanuvchi profili
 */

/**
 * @swagger
 * /profile:
 *   patch:
 *     summary: Profilni yangilash
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName: { type: string }
 *               lastName:  { type: string }
 *               phone:     { type: string }
 *     responses:
 *       200:
 *         description: Profil yangilandi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */

/**
 * @swagger
 * /profile/avatar:
 *   patch:
 *     summary: Avatar yuklash
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               avatar:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Avatar yangilandi
 */

router.use(protect);
router.patch('/', pc.updateProfile);
router.patch('/avatar', uploadAvatar.single('avatar'), pc.updateAvatar);

module.exports = router;
