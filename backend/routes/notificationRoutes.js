const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const nc = require('../controllers/notificationController');

router.use(protect);

router.get('/',              nc.getMyNotifications);
router.patch('/read-all',    nc.markAllRead);
router.patch('/:id/read',    nc.markRead);
router.delete('/:id',        nc.deleteNotification);

module.exports = router;
