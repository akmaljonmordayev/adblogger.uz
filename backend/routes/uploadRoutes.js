const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { uploadGeneral } = require('../config/cloudinary');
const { uploadImages } = require('../controllers/uploadController');

// POST /api/v1/upload  — max 5 ta rasm, har biri 5MB
router.post('/', protect, uploadGeneral.array('images', 5), uploadImages);

module.exports = router;
