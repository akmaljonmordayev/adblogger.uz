const Contact = require('../models/Contact');
const Notification = require('../models/Notification');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const sendEmail = require('../utils/sendEmail');

// POST /api/v1/contact  (optionalAuth → req.user may exist)
exports.sendContact = catchAsync(async (req, res) => {
  const { name, email, phone, subject, message, role } = req.body;

  const contactData = {
    name,
    email,
    phone,
    subject,
    message,
    role: role || 'other',
  };
  if (req.user) contactData.userId = req.user._id;

  const contact = await Contact.create(contactData);

  try {
    await sendEmail({
      to: process.env.EMAIL_USER,
      subject: `[ADBlogger] Yangi xabar: ${subject}`,
      html: `<p><strong>Kimdan:</strong> ${name} (${email})</p>
             <p><strong>Telefon:</strong> ${phone || '—'}</p>
             <p><strong>Rol:</strong> ${role || '—'}</p>
             <p><strong>Mavzu:</strong> ${subject}</p>
             <p><strong>Xabar:</strong><br>${message}</p>`,
    });
  } catch {
    // Don't fail the request if email fails
  }

  res.status(201).json({
    success: true,
    message: "Xabaringiz qabul qilindi. Tez orada aloqaga chiqamiz.",
  });
});

// ── Admin ─────────────────────────────────────────────────────────────────────

exports.getAllContacts = catchAsync(async (req, res) => {
  const filter = req.query.status ? { status: req.query.status } : {};
  const contacts = await Contact.find(filter)
    .populate('userId', 'firstName lastName email avatar role')
    .sort('-createdAt');
  res.status(200).json({ success: true, results: contacts.length, data: contacts });
});

exports.getContact = catchAsync(async (req, res, next) => {
  const contact = await Contact.findByIdAndUpdate(
    req.params.id,
    { $set: { status: 'read' } },
    { new: true }
  ).populate('userId', 'firstName lastName email avatar role');
  if (!contact) return next(new AppError('Xabar topilmadi.', 404));
  res.status(200).json({ success: true, data: contact });
});

exports.updateContactStatus = catchAsync(async (req, res, next) => {
  const contact = await Contact.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status, adminNote: req.body.adminNote },
    { new: true }
  );
  if (!contact) return next(new AppError('Xabar topilmadi.', 404));
  res.status(200).json({ success: true, data: contact });
});

// PATCH /admin/contacts/:id/reply
exports.replyContact = catchAsync(async (req, res, next) => {
  const { reply } = req.body;
  if (!reply?.trim()) return next(new AppError('Javob matni kiritilmadi.', 400));

  const contact = await Contact.findByIdAndUpdate(
    req.params.id,
    { reply: reply.trim(), repliedAt: new Date(), status: 'responded' },
    { new: true }
  ).populate('userId', 'firstName lastName email');

  if (!contact) return next(new AppError('Xabar topilmadi.', 404));

  // Create in-app notification if the sender is a registered user
  if (contact.userId) {
    await Notification.create({
      user: contact.userId._id,
      type: 'contact_reply',
      title: "Sizning xabaringizga javob keldi",
      body: reply.length > 150 ? reply.slice(0, 150) + '...' : reply,
      link: '/notifications',
    });
  }

  // Send email reply
  try {
    await sendEmail({
      to: contact.email,
      subject: `[ADBlogger] Xabaringizga javob: ${contact.subject}`,
      html: `<p>Assalomu alaykum, <strong>${contact.name}</strong>!</p>
             <p><strong>Sizning xabaringiz:</strong></p>
             <blockquote style="border-left:3px solid #e31e24;padding-left:12px;color:#555;margin:8px 0">${contact.message}</blockquote>
             <p><strong>Javobimiz:</strong></p>
             <p>${reply}</p>
             <hr style="margin:16px 0;border:none;border-top:1px solid #eee"/>
             <p style="color:#888;font-size:12px">ADBlogger jamoasi — <a href="https://adblogger.uz">adblogger.uz</a></p>`,
    });
  } catch {
    // Don't fail if email fails
  }

  res.status(200).json({ success: true, data: contact });
});

exports.deleteContact = catchAsync(async (req, res, next) => {
  const contact = await Contact.findByIdAndDelete(req.params.id);
  if (!contact) return next(new AppError('Xabar topilmadi.', 404));
  res.status(204).json({ success: true, data: null });
});
