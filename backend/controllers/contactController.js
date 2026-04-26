const Contact = require('../models/Contact');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const sendEmail = require('../utils/sendEmail');

// POST /api/v1/contact
exports.sendContact = catchAsync(async (req, res) => {
  const { name, email, phone, subject, message } = req.body;

  const contact = await Contact.create({ name, email, phone, subject, message });

  // Notify admin
  try {
    await sendEmail({
      to: process.env.EMAIL_USER,
      subject: `[ADBlogger] Yangi xabar: ${subject}`,
      html: `<p><strong>Kimdan:</strong> ${name} (${email})</p>
             <p><strong>Telefon:</strong> ${phone || '—'}</p>
             <p><strong>Mavzu:</strong> ${subject}</p>
             <p><strong>Xabar:</strong><br>${message}</p>`,
    });
  } catch {
    // Don't fail the request if email fails
  }

  res.status(201).json({ success: true, message: 'Xabaringiz qabul qilindi. Tez orada aloqaga chiqamiz.' });
});

// ── Admin ─────────────────────────────────────────────────────────────────────

exports.getAllContacts = catchAsync(async (req, res) => {
  const filter = req.query.status ? { status: req.query.status } : {};
  const contacts = await Contact.find(filter).sort('-createdAt');
  res.status(200).json({ success: true, results: contacts.length, data: contacts });
});

exports.getContact = catchAsync(async (req, res, next) => {
  const contact = await Contact.findByIdAndUpdate(
    req.params.id,
    { status: 'read' },
    { new: true }
  );
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

exports.deleteContact = catchAsync(async (req, res, next) => {
  const contact = await Contact.findByIdAndDelete(req.params.id);
  if (!contact) return next(new AppError('Xabar topilmadi.', 404));
  res.status(204).json({ success: true, data: null });
});
