const AdApplication = require('../models/AdApplication');
const ChatMessage   = require('../models/ChatMessage');
const Ad            = require('../models/Ad');
const User          = require('../models/User');
const Notification  = require('../models/Notification');
const catchAsync    = require('../utils/catchAsync');
const AppError      = require('../utils/appError');

/* ── POST /api/v1/ad-applications/:adId  ─── zayavka yuborish ── */
exports.applyToAd = catchAsync(async (req, res, next) => {
  const { message } = req.body;

  const ad = await Ad.findById(req.params.adId).populate('user', 'firstName lastName');
  if (!ad) return next(new AppError("E'lon topilmadi", 404));

  if (String(ad.user._id) === String(req.user._id)) {
    return next(new AppError("O'z e'loningizga zayavka yubora olmaysiz", 400));
  }

  // Takroriy zayavkani tekshirish
  const existing = await AdApplication.findOne({ ad: ad._id, applicant: req.user._id });
  if (existing) {
    return next(new AppError("Siz bu e'longa allaqachon zayavka yubordingiz", 400));
  }

  const application = await AdApplication.create({
    ad:           ad._id,
    adOwner:      ad.user._id,
    applicant:    req.user._id,
    message:      message || '',
    lastMessage:  message || '',
    lastMessageAt: new Date(),
    ownerUnread:  1,
  });

  // Boshlang'ich xabarni ChatMessage ga saqlash
  if (message?.trim()) {
    await ChatMessage.create({
      application: application._id,
      sender:      req.user._id,
      text:        message.trim(),
    });
  }

  const io = req.app.get('io');

  // E'lon egasiga Socket.io orqali new_application event
  io.to(`user_${ad.user._id}`).emit('new_application', {
    applicationId: application._id,
    adTitle:       ad.title || ad.companyName || "E'lon",
    applicantName: `${req.user.firstName} ${req.user.lastName}`,
    message:       message || '',
  });

  // Notification DB ga saqlash
  const notif = await Notification.create({
    user:  ad.user._id,
    type:  'new_application',
    title: '📩 Yangi zayavka keldi!',
    body:  `${req.user.firstName} ${req.user.lastName} sizning e'loningizga zayavka yubordi`,
    link:  '/mening-zayavkalarim',
  });

  // Notification ni ham socket orqali yuborish (real-time badge + list update)
  io.to(`user_${ad.user._id}`).emit('new_notification', notif);

  res.status(201).json({ success: true, data: application });
});

/* ── GET /api/v1/ad-applications/received  ─── kelgan zayavkalar ── */
exports.getReceivedApplications = catchAsync(async (req, res) => {
  const applications = await AdApplication
    .find({ adOwner: req.user._id })
    .populate('ad', 'title companyName type productName')
    .populate('applicant', 'firstName lastName avatar email phone')
    .sort('-updatedAt');

  res.status(200).json({ success: true, results: applications.length, data: applications });
});

/* ── GET /api/v1/ad-applications/sent  ─── yuborgan zayavkalar ── */
exports.getSentApplications = catchAsync(async (req, res) => {
  const applications = await AdApplication
    .find({ applicant: req.user._id })
    .populate('ad', 'title companyName type productName')
    .populate('adOwner', 'firstName lastName avatar email phone')
    .sort('-updatedAt');

  res.status(200).json({ success: true, results: applications.length, data: applications });
});

/* ── GET /api/v1/ad-applications/:appId/messages ─── chat xabarlari ── */
exports.getMessages = catchAsync(async (req, res, next) => {
  const app = await AdApplication.findById(req.params.appId);
  if (!app) return next(new AppError('Zayavka topilmadi', 404));

  const userId = String(req.user._id);
  const isOwner = userId === String(app.adOwner);
  const isApplicant = userId === String(app.applicant);

  if (!isOwner && !isApplicant) {
    return next(new AppError("Ruxsat yo'q", 403));
  }

  const messages = await ChatMessage
    .find({ application: req.params.appId })
    .populate('sender', 'firstName lastName avatar')
    .sort('createdAt');

  // O'qilmagan xabarlarni belgilash
  const updateResult = await ChatMessage.updateMany(
    { application: app._id, sender: { $ne: req.user._id }, isRead: false },
    { isRead: true }
  );

  // Unread countni nollash
  const update = {};
  if (isOwner) {
    update.ownerUnread = 0;
    if (app.status === 'pending') update.status = 'read';
  } else {
    update.applicantUnread = 0;
  }
  if (Object.keys(update).length) {
    await AdApplication.findByIdAndUpdate(app._id, update);
  }

  // Xabar yuboruvchiga "o'qildi" signali yuborish
  const otherId = isOwner ? app.applicant : app.adOwner;
  if (updateResult.modifiedCount > 0) {
    const io = req.app.get('io');
    io.to(`user_${otherId}`).emit('messages_read', { applicationId: String(app._id) });
  }

  // Blok holatini aniqlash
  const myBlockedUsers = req.user.blockedUsers || [];
  const iBlockedThem   = myBlockedUsers.some(id => String(id) === String(otherId));
  const otherUser      = await User.findById(otherId).select('blockedUsers');
  const theyBlockedMe  = (otherUser?.blockedUsers || []).some(id => String(id) === String(req.user._id));

  res.status(200).json({
    success: true,
    results: messages.length,
    data: messages,
    iBlockedThem,
    theyBlockedMe,
    isBlocked: iBlockedThem || theyBlockedMe,
  });
});

/* ── POST /api/v1/ad-applications/:appId/messages ─── xabar yuborish ── */
exports.sendMessage = catchAsync(async (req, res, next) => {
  const { text } = req.body;
  if (!text?.trim()) return next(new AppError("Xabar bo'sh bo'lishi mumkin emas", 400));

  const app = await AdApplication.findById(req.params.appId);
  if (!app) return next(new AppError('Zayavka topilmadi', 404));

  const userId = String(req.user._id);
  const isOwner = userId === String(app.adOwner);
  const isApplicant = userId === String(app.applicant);

  if (!isOwner && !isApplicant) {
    return next(new AppError("Ruxsat yo'q", 403));
  }

  // Blok tekshiruvi
  const otherId2      = isOwner ? app.applicant : app.adOwner;
  const myBlocked     = req.user.blockedUsers || [];
  const iBlockedOther = myBlocked.some(id => String(id) === String(otherId2));
  if (iBlockedOther) return next(new AppError("Siz bu foydalanuvchini bloklagan siz", 403));
  const otherUser2    = await User.findById(otherId2).select('blockedUsers');
  const otherBlocked  = (otherUser2?.blockedUsers || []).some(id => String(id) === String(req.user._id));
  if (otherBlocked)   return next(new AppError("Bu foydalanuvchi sizni bloklagan", 403));

  const msg = await ChatMessage.create({
    application: app._id,
    sender:      req.user._id,
    text:        text.trim(),
  });

  // Application ni yangilash
  const updateData = {
    lastMessage:   text.trim(),
    lastMessageAt: new Date(),
  };
  if (isOwner) {
    updateData.applicantUnread = (app.applicantUnread || 0) + 1;
  } else {
    updateData.ownerUnread = (app.ownerUnread || 0) + 1;
  }
  await AdApplication.findByIdAndUpdate(app._id, updateData);

  const populated = await msg.populate('sender', 'firstName lastName avatar');

  // Ikkinchi foydalanuvchiga Socket.io orqali yuborish
  const otherId = isOwner ? app.applicant : app.adOwner;
  const io = req.app.get('io');
  const payload = { applicationId: String(app._id), message: populated };
  io.to(`user_${otherId}`).emit('new_chat_message', payload);
  io.to(`chat_${app._id}`).emit('new_chat_message', payload);

  res.status(201).json({ success: true, data: populated });
});

/* ── PATCH /api/v1/ad-applications/:appId/messages/:msgId ─── xabarni tahrirlash ── */
exports.editMessage = catchAsync(async (req, res, next) => {
  const { text } = req.body;
  if (!text?.trim()) return next(new AppError("Xabar bo'sh bo'lishi mumkin emas", 400));

  const msg = await ChatMessage.findById(req.params.msgId);
  if (!msg) return next(new AppError('Xabar topilmadi', 404));
  if (String(msg.sender) !== String(req.user._id)) {
    return next(new AppError("Faqat o'z xabaringizni tahrirlashingiz mumkin", 403));
  }

  msg.text   = text.trim();
  msg.edited = true;
  await msg.save();

  const io = req.app.get('io');
  io.to(`chat_${req.params.appId}`).emit('message_edited', {
    applicationId: req.params.appId,
    messageId:     String(msg._id),
    text:          msg.text,
  });

  res.status(200).json({ success: true, data: msg });
});

/* ── DELETE /api/v1/ad-applications/:appId/messages/:msgId ─── xabarni o'chirish ── */
exports.deleteMessage = catchAsync(async (req, res, next) => {
  const msg = await ChatMessage.findById(req.params.msgId);
  if (!msg) return next(new AppError('Xabar topilmadi', 404));
  if (String(msg.sender) !== String(req.user._id)) {
    return next(new AppError("Faqat o'z xabaringizni o'chirishingiz mumkin", 403));
  }

  // Softdelete — "Xabar o'chirildi" ko'rsatish uchun
  msg.deleted = true;
  await msg.save();

  const io = req.app.get('io');
  io.to(`chat_${req.params.appId}`).emit('message_deleted', {
    applicationId: req.params.appId,
    messageId:     String(msg._id),
  });

  res.status(200).json({ success: true });
});

/* ── PATCH /api/v1/ad-applications/:appId/status ─── status o'zgartirish ── */
exports.updateStatus = catchAsync(async (req, res, next) => {
  const { status } = req.body;
  const allowed = ['accepted', 'rejected', 'read'];
  if (!allowed.includes(status)) {
    return next(new AppError("Noto'g'ri status", 400));
  }

  const app = await AdApplication.findById(req.params.appId);
  if (!app) return next(new AppError('Zayavka topilmadi', 404));

  if (String(app.adOwner) !== String(req.user._id)) {
    return next(new AppError("Ruxsat yo'q", 403));
  }

  await AdApplication.findByIdAndUpdate(app._id, { status });

  if (status === 'accepted' || status === 'rejected') {
    const io = req.app.get('io');
    io.to(`user_${app.applicant}`).emit('application_status_changed', {
      applicationId: String(app._id),
      status,
    });

    const statusNotif = await Notification.create({
      user:  app.applicant,
      type:  'application_status',
      title: status === 'accepted' ? '✅ Zayavkangiz qabul qilindi!' : '❌ Zayavkangiz rad etildi',
      body:  status === 'accepted'
        ? "E'lon egasi zayavkangizni qabul qildi. Chat orqali muloqot qilishingiz mumkin."
        : "Afsuski, zayavkangiz rad etildi.",
      link:  `/mening-zayavkalarim?tab=sent&appId=${app._id}`,
    });
    io.to(`user_${app.applicant}`).emit('new_notification', statusNotif);
  }

  res.status(200).json({ success: true });
});

/* ── POST /api/v1/ad-applications/:appId/block ─── foydalanuvchini bloklash ── */
exports.blockUser = catchAsync(async (req, res, next) => {
  const app = await AdApplication.findById(req.params.appId);
  if (!app) return next(new AppError('Zayavka topilmadi', 404));

  const myId        = String(req.user._id);
  const isOwner     = myId === String(app.adOwner);
  const isApplicant = myId === String(app.applicant);
  if (!isOwner && !isApplicant) return next(new AppError("Ruxsat yo'q", 403));

  const targetId = isOwner ? app.applicant : app.adOwner;
  if (String(targetId) === myId) return next(new AppError("O'zingizni bloklay olmaysiz", 400));

  await User.findByIdAndUpdate(req.user._id, { $addToSet: { blockedUsers: targetId } });

  const io = req.app.get('io');
  io.to(`user_${targetId}`).emit('user_blocked', { applicationId: String(app._id) });

  res.status(200).json({ success: true });
});

/* ── DELETE /api/v1/ad-applications/:appId/block ─── blokdan chiqarish ── */
exports.unblockUser = catchAsync(async (req, res, next) => {
  const app = await AdApplication.findById(req.params.appId);
  if (!app) return next(new AppError('Zayavka topilmadi', 404));

  const myId        = String(req.user._id);
  const isOwner     = myId === String(app.adOwner);
  const isApplicant = myId === String(app.applicant);
  if (!isOwner && !isApplicant) return next(new AppError("Ruxsat yo'q", 403));

  const targetId = isOwner ? app.applicant : app.adOwner;

  await User.findByIdAndUpdate(req.user._id, { $pull: { blockedUsers: targetId } });

  const io = req.app.get('io');
  io.to(`user_${targetId}`).emit('user_unblocked', { applicationId: String(app._id) });

  res.status(200).json({ success: true });
});
