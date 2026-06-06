const BloggerOrder = require('../models/BloggerOrder');
const Blogger      = require('../models/Blogger');
const User         = require('../models/User');
const ChatMessage  = require('../models/ChatMessage');
const Notification = require('../models/Notification');
const catchAsync   = require('../utils/catchAsync');
const AppError     = require('../utils/appError');

/* ── helpers ── */
const isParticipant = (order, userId) => {
  const uid = String(userId);
  return uid === String(order.blogger?._id || order.blogger) ||
         uid === String(order.business?._id || order.business);
};

/* ── POST /api/v1/blogger-orders/:bloggerId ── buyurtma yaratish ── */
exports.createOrder = catchAsync(async (req, res, next) => {
  const { projectName, services, platforms, brief, budget } = req.body;

  if (!brief?.trim()) return next(new AppError("Brief kiritilishi shart", 400));

  // Blogger topish
  const bloggerProfile = await Blogger.findOne({ user: req.params.bloggerId }).populate('user', 'firstName lastName avatar');
  if (!bloggerProfile) return next(new AppError('Blogger topilmadi', 404));

  const bloggerId   = String(bloggerProfile.user._id);
  const businessId  = String(req.user._id);

  if (bloggerId === businessId) return next(new AppError("O'zingizga buyurtma bera olmaysiz", 400));

  // Blok tekshiruvi
  const myBlocked    = req.user.blockedUsers || [];
  if (myBlocked.some(id => String(id) === bloggerId))
    return next(new AppError("Siz bu foydalanuvchini bloklagan siz", 403));
  const bloggerUser  = await User.findById(bloggerId).select('blockedUsers');
  if ((bloggerUser?.blockedUsers || []).some(id => String(id) === businessId))
    return next(new AppError("Bu blogger sizni bloklagan", 403));

  const order = await BloggerOrder.create({
    blogger:        bloggerId,
    business:       businessId,
    bloggerProfile: bloggerProfile._id,
    projectName:    projectName?.trim() || '',
    services:       Array.isArray(services) ? services : (services ? [services] : []),
    platforms:      Array.isArray(platforms) ? platforms : (platforms ? [platforms] : []),
    brief:          brief.trim(),
    budget:         Number(budget) || 0,
    lastMessage:    brief.trim().slice(0, 100),
    lastMessageAt:  new Date(),
    bloggerUnread:  1,
  });

  // Dastlabki xabar sifatida brief ni saqlash
  await ChatMessage.create({
    order:   order._id,
    sender:  req.user._id,
    text:    brief.trim(),
  });

  // Blogger'ga notification
  const notif = await Notification.create({
    user:  bloggerId,
    type:  'new_application',
    title: 'Yangi buyurtma!',
    body:  `${req.user.firstName} ${req.user.lastName} buyurtma yubordi: ${projectName || brief.trim().slice(0, 60)}`,
    link:  '/mening-zayavkalarim',
  });

  const io = req.app.get('io');
  io.to(`user_${bloggerId}`).emit('new_order', { order });
  io.to(`user_${bloggerId}`).emit('new_notification', notif);

  res.status(201).json({ success: true, data: order });
});

/* ── GET /api/v1/blogger-orders ── mening buyurtmalarim ── */
exports.getMyOrders = catchAsync(async (req, res) => {
  const myId = String(req.user._id);
  const orders = await BloggerOrder.find({
    $or: [
      { blogger:  myId, deletedForBlogger:  { $ne: true } },
      { business: myId, deletedForBusiness: { $ne: true } },
    ],
  })
    .populate('blogger',  'firstName lastName avatar')
    .populate('business', 'firstName lastName avatar')
    .sort('-lastMessageAt');

  res.status(200).json({ success: true, results: orders.length, data: orders });
});

/* ── GET /api/v1/blogger-orders/:orderId/messages ── xabarlar ── */
exports.getMessages = catchAsync(async (req, res, next) => {
  const order = await BloggerOrder.findById(req.params.orderId)
    .populate('blogger',  'firstName lastName avatar')
    .populate('business', 'firstName lastName avatar');
  if (!order) return next(new AppError('Buyurtma topilmadi', 404));
  if (!isParticipant(order, req.user._id)) return next(new AppError("Ruxsat yo'q", 403));

  const myId      = String(req.user._id);
  const isBlogger = myId === String(order.blogger?._id || order.blogger);
  const otherDoc  = isBlogger ? order.business : order.blogger;
  const otherId   = otherDoc?._id || otherDoc; // always an ObjectId

  const messages = await ChatMessage
    .find({ order: order._id })
    .populate('sender', 'firstName lastName avatar')
    .sort('createdAt');

  // O'qilmagan xabarlarni belgilash
  const updateResult = await ChatMessage.updateMany(
    { order: order._id, sender: { $ne: req.user._id }, isRead: false },
    { isRead: true }
  );

  // Unread countni nollash
  const upd = isBlogger ? { bloggerUnread: 0 } : { businessUnread: 0 };
  if (isBlogger && order.status === 'pending') upd.status = 'read';
  await BloggerOrder.findByIdAndUpdate(order._id, upd);

  // messages_read signali
  if (updateResult.modifiedCount > 0) {
    const io = req.app.get('io');
    io.to(`user_${otherId}`).emit('order_messages_read', { orderId: String(order._id) });
  }

  // Blok holati
  const myBlocked     = req.user.blockedUsers || [];
  const iBlockedThem  = myBlocked.some(id => String(id) === String(otherId));
  const otherUser     = await User.findById(otherId).select('blockedUsers');
  const theyBlockedMe = (otherUser?.blockedUsers || []).some(id => String(id) === String(req.user._id));

  res.status(200).json({
    success: true,
    results: messages.length,
    data: messages,
    order,
    iBlockedThem,
    theyBlockedMe,
    isBlocked: iBlockedThem || theyBlockedMe,
  });
});

/* ── POST /api/v1/blogger-orders/:orderId/messages ── xabar yuborish ── */
exports.sendMessage = catchAsync(async (req, res, next) => {
  const { text } = req.body;
  if (!text?.trim()) return next(new AppError("Xabar bo'sh bo'lishi mumkin emas", 400));

  const order = await BloggerOrder.findById(req.params.orderId);
  if (!order) return next(new AppError('Buyurtma topilmadi', 404));
  if (!isParticipant(order, req.user._id)) return next(new AppError("Ruxsat yo'q", 403));

  const myId      = String(req.user._id);
  const isBlogger = myId === String(order.blogger);
  const otherId   = isBlogger ? order.business : order.blogger;

  // Blok tekshiruvi
  const myBlocked    = req.user.blockedUsers || [];
  if (myBlocked.some(id => String(id) === String(otherId)))
    return next(new AppError("Siz bu foydalanuvchini bloklagan siz", 403));
  const otherUser = await User.findById(otherId).select('blockedUsers');
  if ((otherUser?.blockedUsers || []).some(id => String(id) === myId))
    return next(new AppError("Bu foydalanuvchi sizni bloklagan", 403));

  const msg = await ChatMessage.create({
    order:  order._id,
    sender: req.user._id,
    text:   text.trim(),
  });

  const updateData = { lastMessage: text.trim(), lastMessageAt: new Date() };
  if (isBlogger) updateData.businessUnread = (order.businessUnread || 0) + 1;
  else           updateData.bloggerUnread  = (order.bloggerUnread  || 0) + 1;
  await BloggerOrder.findByIdAndUpdate(order._id, updateData);

  const populated = await msg.populate('sender', 'firstName lastName avatar');

  const io      = req.app.get('io');
  const payload = { orderId: String(order._id), message: populated };
  io.to(`user_${otherId}`).emit('new_order_message', payload);
  io.to(`order_${order._id}`).emit('new_order_message', payload);

  res.status(201).json({ success: true, data: populated });
});

/* ── PATCH /api/v1/blogger-orders/:orderId/messages/:msgId ── tahrirlash ── */
exports.editMessage = catchAsync(async (req, res, next) => {
  const { text } = req.body;
  if (!text?.trim()) return next(new AppError("Xabar bo'sh bo'lishi mumkin emas", 400));

  const msg = await ChatMessage.findById(req.params.msgId);
  if (!msg || String(msg.order) !== req.params.orderId)
    return next(new AppError('Xabar topilmadi', 404));
  if (String(msg.sender) !== String(req.user._id))
    return next(new AppError("Faqat o'z xabaringizni tahrirlashingiz mumkin", 403));

  msg.text   = text.trim();
  msg.edited = true;
  await msg.save();

  const io = req.app.get('io');
  io.to(`order_${req.params.orderId}`).emit('order_message_edited', {
    orderId:   req.params.orderId,
    messageId: String(msg._id),
    text:      msg.text,
  });

  res.status(200).json({ success: true, data: msg });
});

/* ── DELETE /api/v1/blogger-orders/:orderId/messages/:msgId ── o'chirish ── */
exports.deleteMessage = catchAsync(async (req, res, next) => {
  const msg = await ChatMessage.findById(req.params.msgId);
  if (!msg || String(msg.order) !== req.params.orderId)
    return next(new AppError('Xabar topilmadi', 404));
  if (String(msg.sender) !== String(req.user._id))
    return next(new AppError("Faqat o'z xabaringizni o'chirishingiz mumkin", 403));

  msg.deleted = true;
  await msg.save();

  const io = req.app.get('io');
  io.to(`order_${req.params.orderId}`).emit('order_message_deleted', {
    orderId:   req.params.orderId,
    messageId: String(msg._id),
  });

  res.status(200).json({ success: true });
});

/* ── PATCH /api/v1/blogger-orders/:orderId/status ── status ── */
exports.updateStatus = catchAsync(async (req, res, next) => {
  const { status } = req.body;
  const allowed = ['accepted', 'rejected', 'in_progress', 'completed'];
  if (!allowed.includes(status)) return next(new AppError("Noto'g'ri status", 400));

  const order = await BloggerOrder.findById(req.params.orderId);
  if (!order) return next(new AppError('Buyurtma topilmadi', 404));

  // Faqat blogger status o'zgartira oladi (accepted/rejected/in_progress)
  if (String(order.blogger) !== String(req.user._id))
    return next(new AppError("Ruxsat yo'q", 403));

  await BloggerOrder.findByIdAndUpdate(order._id, { status });

  const io = req.app.get('io');
  io.to(`user_${order.business}`).emit('order_status_changed', {
    orderId: String(order._id),
    status,
  });

  const notif = await Notification.create({
    user:  order.business,
    type:  'application_status',
    title: status === 'accepted' ? 'Buyurtma qabul qilindi!' : status === 'rejected' ? 'Buyurtma rad etildi' : 'Buyurtma yangilandi',
    body:  status === 'accepted'
      ? "Blogger buyurtmangizni qabul qildi. Chat orqali muloqot qilishingiz mumkin."
      : status === 'rejected'
      ? "Afsuski, blogger buyurtmangizni rad etdi."
      : `Buyurtma holati: ${status}`,
    link: '/mening-zayavkalarim',
  });
  io.to(`user_${order.business}`).emit('new_notification', notif);

  res.status(200).json({ success: true });
});

/* ── POST /api/v1/blogger-orders/:orderId/block ── bloklash ── */
exports.blockUser = catchAsync(async (req, res, next) => {
  const order = await BloggerOrder.findById(req.params.orderId);
  if (!order) return next(new AppError('Buyurtma topilmadi', 404));
  if (!isParticipant(order, req.user._id)) return next(new AppError("Ruxsat yo'q", 403));

  const myId     = String(req.user._id);
  const isBlogger = myId === String(order.blogger);
  const targetId  = isBlogger ? order.business : order.blogger;
  if (String(targetId) === myId) return next(new AppError("O'zingizni bloklay olmaysiz", 400));

  await User.findByIdAndUpdate(req.user._id, { $addToSet: { blockedUsers: targetId } });

  const io = req.app.get('io');
  io.to(`user_${targetId}`).emit('user_blocked', { orderId: String(order._id) });

  res.status(200).json({ success: true });
});

/* ── DELETE /api/v1/blogger-orders/:orderId ── buyurtmani o'chirish ── */
exports.deleteOrder = catchAsync(async (req, res, next) => {
  const order = await BloggerOrder.findById(req.params.orderId);
  if (!order) return next(new AppError('Buyurtma topilmadi', 404));
  if (!isParticipant(order, req.user._id)) return next(new AppError("Ruxsat yo'q", 403));

  const myId      = String(req.user._id);
  const isBlogger = myId === String(order.blogger?._id || order.blogger);

  // Har bir tomon o'z tomonidan o'chiradi (soft-delete)
  if (isBlogger) {
    order.deletedForBlogger = true;
  } else {
    order.deletedForBusiness = true;
  }

  // Ikkalasi ham o'chirgan bo'lsa — bazadan o'chirib yuboramiz
  if (order.deletedForBlogger && order.deletedForBusiness) {
    await ChatMessage.deleteMany({ order: order._id });
    await BloggerOrder.findByIdAndDelete(order._id);
  } else {
    await order.save();
  }

  res.status(200).json({ success: true });
});

/* ── DELETE /api/v1/blogger-orders/:orderId/block ── blokdan chiqarish ── */
exports.unblockUser = catchAsync(async (req, res, next) => {
  const order = await BloggerOrder.findById(req.params.orderId);
  if (!order) return next(new AppError('Buyurtma topilmadi', 404));
  if (!isParticipant(order, req.user._id)) return next(new AppError("Ruxsat yo'q", 403));

  const myId     = String(req.user._id);
  const isBlogger = myId === String(order.blogger);
  const targetId  = isBlogger ? order.business : order.blogger;

  await User.findByIdAndUpdate(req.user._id, { $pull: { blockedUsers: targetId } });

  const io = req.app.get('io');
  io.to(`user_${targetId}`).emit('user_unblocked', { orderId: String(order._id) });

  res.status(200).json({ success: true });
});
