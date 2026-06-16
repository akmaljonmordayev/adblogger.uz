const express = require('express');
const router  = express.Router();
const { globalSearch } = require('../controllers/searchController');

// GET /api/v1/search?q=...
router.get('/', globalSearch);

module.exports = router;
