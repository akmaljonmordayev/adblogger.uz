const express = require('express');
const router = express.Router();
const pc = require('../controllers/profileController');
const { protect } = require('../middleware/auth');
const { uploadAvatar } = require('../config/cloudinary');
const AppError = require('../utils/appError');


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
router.patch('/avatar', (req, res, next) => {
  uploadAvatar.single('avatar')(req, res, (err) => {
    if (err) {
      console.error('[Avatar upload error]', err.message || err);
      const msg = err.message || 'Rasm yuklab bo\'lmadi';
      return next(new AppError(msg, 400));
    }
    next();
  });
}, pc.updateAvatar);

module.exports = router;
