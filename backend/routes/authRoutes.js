const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Autentifikatsiya
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Ro'yxatdan o'tish
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterInput'
 *     responses:
 *       201:
 *         description: Muvaffaqiyatli ro'yxatdan o'tildi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Noto'g'ri ma'lumot
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/register', authController.register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Tizimga kirish
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginInput'
 *     responses:
 *       200:
 *         description: Muvaffaqiyatli kirildi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       401:
 *         description: Email yoki parol noto'g'ri
 */
router.post('/login', authController.login);

/**
 * @swagger
 * /auth/admin-login:
 *   post:
 *     summary: Admin tizimga kirish
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginInput'
 *     responses:
 *       200:
 *         description: Admin muvaffaqiyatli kirdi
 */
router.post('/admin-login', authController.adminLogin);

/**
 * @swagger
 * /auth/forgot-password:
 *   post:
 *     summary: Parolni unutdim
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: akmal@mail.com
 *     responses:
 *       200:
 *         description: Reset link emailga yuborildi
 */
router.post('/forgot-password', authController.forgotPassword);

/**
 * @swagger
 * /auth/reset-password/{token}:
 *   patch:
 *     summary: Parolni tiklash
 *     tags: [Auth]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: token
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
 *               password:
 *                 type: string
 *                 example: newpassword123
 *     responses:
 *       200:
 *         description: Parol muvaffaqiyatli yangilandi
 */
router.patch('/reset-password/:token', authController.resetPassword);

router.use(protect);

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Joriy foydalanuvchi ma'lumotlari
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Foydalanuvchi ma'lumotlari
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */
router.get('/me', authController.getMe);

/**
 * @swagger
 * /auth/update-password:
 *   patch:
 *     summary: Parolni yangilash
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               currentPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Parol yangilandi
 */
router.patch('/update-password', authController.updatePassword);

module.exports = router;
