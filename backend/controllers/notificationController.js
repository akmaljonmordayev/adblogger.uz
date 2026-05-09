const Notification = require('../models/Notification');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// GET /api/v1/notifications
exports.getMyNotifications = catchAsync(async (req, res) => {
  const filter = { user: req.user._id };
  if (req.query.unread === 'true') filter.read = false;

  const notifications = await Notification.find(filter).sort('-createdAt').limit(100);
  const unreadCount = await Notification.countDocuments({ user: req.user._id, read: false });

  res.status(200).json({ success: true, results: notifications.length, unreadCount, data: notifications });
});

// PATCH /api/v1/notifications/read-all
exports.markAllRead = catchAsync(async (req, res) => {
  await Notification.updateMany({ user: req.user._id, read: false }, { read: true });
  res.status(200).json({ success: true, message: "Barcha bildirishnomalar o'qildi." });
});

// PATCH /api/v1/notifications/:id/read
exports.markRead = catchAsync(async (req, res, next) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    { read: true },
    { new: true }
  );
  if (!notification) return next(new AppError('Bildirishnoma topilmadi.', 404));
  res.status(200).json({ success: true, data: notification });
});

// DELETE /api/v1/notifications/:id
exports.deleteNotification = catchAsync(async (req, res, next) => {
  const notification = await Notification.findOneAndDelete({
    _id: req.params.id,
    user: req.user._id,
  });
  if (!notification) return next(new AppError('Bildirishnoma topilmadi.', 404));
  res.status(204).json({ success: true, data: null });
});
