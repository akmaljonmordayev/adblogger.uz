const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const authController = require('../controllers/authController');
const { protect } = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Autentifikatsiya
 */

// Stricter rate limiter for OTP endpoints — max 5 requests per 15 minutes
const otpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    success: false,
    message: "Juda ko'p urinish. 15 daqiqadan so'ng qayta urinib ko'ring.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// ── OTP Registration / Login routes (public, rate-limited) ──────────────────
router.post('/send-registration-otp', otpLimiter, authController.sendRegistrationOtp);
router.post('/verify-registration-otp', otpLimiter, authController.verifyRegistrationOtp);
router.post('/send-login-otp', otpLimiter, authController.sendLoginOtp);
router.post('/verify-login-otp', otpLimiter, authController.verifyLoginOtp);

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Ro'yxatdan o'tish (legacy)
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
 *       400:
 *         description: Noto'g'ri ma'lumot
 */
router.post('/register', authController.register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Tizimga kirish (password-based)
 *     tags: [Auth]
 *     security: []
 */
router.post('/login', authController.login);

/**
 * @swagger
 * /auth/admin-login:
 *   post:
 *     summary: Admin tizimga kirish
 *     tags: [Auth]
 *     security: []
 */
router.post('/admin-login', authController.adminLogin);

/**
 * @swagger
 * /auth/forgot-password:
 *   post:
 *     summary: Parolni unutdim
 *     tags: [Auth]
 *     security: []
 */
router.post('/forgot-password', authController.forgotPassword);

/**
 * @swagger
 * /auth/reset-password/{token}:
 *   patch:
 *     summary: Parolni tiklash
 *     tags: [Auth]
 *     security: []
 */
router.patch('/reset-password/:token', authController.resetPassword);

// Public: check application status by userId (for pending approval page on remount)
router.get('/check-status/:userId', authController.checkApplicationStatus);

router.use(protect);

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Joriy foydalanuvchi ma'lumotlari
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
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
 */
router.patch('/update-password', authController.updatePassword);
router.patch('/complete-onboarding', authController.completeOnboarding);

module.exports = router;
