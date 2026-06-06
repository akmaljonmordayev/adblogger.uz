const express = require('express');
const router  = express.Router();
const { protect } = require('../middleware/auth');
const ctrl = require('../controllers/bloggerOrderController');

router.get('/',                                   protect, ctrl.getMyOrders);
router.post('/:bloggerId',                        protect, ctrl.createOrder);
router.get('/:orderId/messages',                  protect, ctrl.getMessages);
router.post('/:orderId/messages',                 protect, ctrl.sendMessage);
router.patch('/:orderId/messages/:msgId',         protect, ctrl.editMessage);
router.delete('/:orderId/messages/:msgId',        protect, ctrl.deleteMessage);
router.patch('/:orderId/status',                  protect, ctrl.updateStatus);
router.delete('/:orderId',                        protect, ctrl.deleteOrder);
router.post('/:orderId/block',                    protect, ctrl.blockUser);
router.delete('/:orderId/block',                  protect, ctrl.unblockUser);

module.exports = router;
