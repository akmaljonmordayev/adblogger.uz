const express = require('express');
const router  = express.Router();
const { protect } = require('../middleware/auth');
const ctrl = require('../controllers/adApplicationController');

// Statik routlar oldin (dynamic /:id dan oldin bo'lishi shart)
router.get('/received',               protect, ctrl.getReceivedApplications);
router.get('/sent',                   protect, ctrl.getSentApplications);

// Dynamic routlar
router.post('/:adId',                 protect, ctrl.applyToAd);
router.get('/:appId/messages',                    protect, ctrl.getMessages);
router.post('/:appId/messages',                   protect, ctrl.sendMessage);
router.patch('/:appId/messages/:msgId',           protect, ctrl.editMessage);
router.delete('/:appId/messages/:msgId',          protect, ctrl.deleteMessage);
router.patch('/:appId/status',                    protect, ctrl.updateStatus);

module.exports = router;
