const crypto = require('crypto');
const User = require('../models/User');
const Blogger = require('../models/Blogger');
const Notification = require('../models/Notification');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const { sendTokenResponse, generateToken } = require('../utils/generateToken');
const sendEmail = require('../utils/sendEmail');
const { registrationOtpTemplate, loginOtpTemplate } = sendEmail;

// Helper: sanitize a string input (strip <>, trim, limit length)
function sanitizeStr(val, maxLen = 200) {
  if (typeof val !== 'string') return val;
  return val.replace(/[<>]/g, '').trim().slice(0, maxLen);
}

// POST /api/v1/auth/register (legacy — kept for backward compatibility)
exports.register = catchAsync(async (req, res, next) => {
  const { firstName, lastName, email, phone, password, role, platforms, followers, categories } = req.body;

  const allowedRoles = ['blogger', 'business'];
  if (!allowedRoles.includes(role)) {
    return next(new AppError("Iltimos, 'blogger' yoki 'business' rolini tanlang.", 400));
  }
  const userRole = role;

  const user = await User.create({
    firstName,
    lastName,
    email,
    phone,
    password,
    role: userRole,
    applicationStatus: 'pending',
  });

  // If registering as blogger, create blogger profile with initial data
  if (userRole === 'blogger') {
    const bloggerData = { user: user._id };
    if (platforms) bloggerData.platforms = Array.isArray(platforms) ? platforms : [platforms];
    if (followers)  bloggerData.followers = Number(followers) || 0;
    if (categories) bloggerData.categories = Array.isArray(categories) ? categories : [categories];
    await Blogger.create(bloggerData);
  }

  // Notify admin via socket that a new application arrived
  const io = req.app.get('io');
  if (io) {
    io.to('admin_room').emit('new_application', {
      userId: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    });
  }

  res.status(201).json({
    success: true,
    status: 'pending',
    userId: user._id,
    message: "Arizangiz qabul qilindi. Admin ko'rib chiqgandan so'ng hisobingiz faollashtiriladi.",
  });
});

// POST /api/v1/auth/send-registration-otp
exports.sendRegistrationOtp = catchAsync(async (req, res, next) => {
  const { role, firstName, lastName, email, phone, _hp, _time } = req.body;

  // Honeypot check — if filled, it's likely a bot
  if (_hp && String(_hp).length > 0) {
    return next(new AppError('Xatolik yuz berdi.', 400));
  }

  // Timing check — submitted too quickly (< 3 seconds)
  if (_time) {
    const elapsed = Date.now() - parseInt(_time, 10);
    if (elapsed < 3000) {
      return next(new AppError('Xatolik yuz berdi.', 400));
    }
  }

  // Validate role
  const allowedRoles = ['blogger', 'business'];
  if (!allowedRoles.includes(role)) {
    return next(new AppError("Iltimos, 'blogger' yoki 'business' rolini tanlang.", 400));
  }

  // Validate required fields
  if (!firstName || !email) {
    return next(new AppError('Ism va email kiritilishi shart.', 400));
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return next(new AppError("Email formati noto'g'ri.", 400));
  }

  // Sanitize inputs
  const cleanFirstName = sanitizeStr(firstName, 100);
  const cleanLastName  = sanitizeStr(lastName || '', 100);
  const cleanEmail     = sanitizeStr(email, 254).toLowerCase();
  const cleanPhone     = sanitizeStr(phone || '', 50);

  // Check if email already exists and is NOT pre_register
  const existingUser = await User.findOne({ email: cleanEmail });
  if (existingUser && existingUser.applicationStatus !== 'pre_register') {
    return next(new AppError("Bu email allaqachon ro'yxatdan o'tgan.", 409));
  }

  let user;
  let isNew = false;

  if (existingUser && existingUser.applicationStatus === 'pre_register') {
    // Update existing pre_register user
    user = existingUser;
    user.firstName = cleanFirstName;
    user.lastName  = cleanLastName;
    user.phone     = cleanPhone;
    user.role      = role;
  } else {
    // Create new user with temporary random password
    user = new User({
      firstName: cleanFirstName,
      lastName:  cleanLastName || cleanFirstName,
      email:     cleanEmail,
      phone:     cleanPhone,
      role,
      applicationStatus: 'pre_register',
      password: crypto.randomBytes(16).toString('hex'),
    });
    isNew = true;
  }

  // Generate email OTP
  const otp = user.createEmailOtp();
  await user.save({ validateBeforeSave: false });

  // Send OTP email
  try {
    await sendEmail({
      to: user.email,
      subject: `${otp} — Adblogger.uz tasdiqlash kodi`,
      html: registrationOtpTemplate(user.firstName, otp),
    });
  } catch (err) {
    // If email failed and user was just created, clean up
    if (isNew) {
      await User.findByIdAndDelete(user._id);
    }
    return next(new AppError("Email yuborishda xatolik yuz berdi. Keyinroq urinib ko'ring.", 500));
  }

  res.status(200).json({
    success: true,
    message: `Tasdiqlash kodi ${cleanEmail} manziliga yuborildi.`,
    userId: user._id,
  });
});

// POST /api/v1/auth/verify-registration-otp
exports.verifyRegistrationOtp = catchAsync(async (req, res, next) => {
  const { userId, otp } = req.body;

  if (!userId || !otp) {
    return next(new AppError('userId va otp kiritilishi shart.', 400));
  }

  const user = await User.findById(userId).select('+emailOtp +emailOtpExpires');
  if (!user || user.applicationStatus !== 'pre_register') {
    return next(new AppError('Foydalanuvchi topilmadi yoki ariza holati noto\'g\'ri.', 404));
  }

  // Check expiry
  if (!user.emailOtpExpires || user.emailOtpExpires < Date.now()) {
    return next(new AppError('OTP kodi muddati tugagan. Yangi kod so\'rang.', 400));
  }

  // Verify OTP
  const hashedInput = crypto.createHash('sha256').update(String(otp)).digest('hex');
  if (hashedInput !== user.emailOtp) {
    return next(new AppError("OTP kodi noto'g'ri.", 400));
  }

  // Clear OTP fields and update status
  user.emailOtp = undefined;
  user.emailOtpExpires = undefined;
  user.applicationStatus = 'pending';
  user.onboardingStep = 1;
  await user.save({ validateBeforeSave: false });

  // Create blogger profile if needed
  if (user.role === 'blogger') {
    const existingBlogger = await Blogger.findOne({ user: user._id });
    if (!existingBlogger) {
      await Blogger.create({ user: user._id });
    }
  }

  // Find admin and create notification
  const admin = await User.findOne({ role: 'admin' });
  if (admin) {
    const notif = await Notification.create({
      user:  admin._id,
      type:  'new_application',
      title: 'Yangi ariza',
      body:  `${user.firstName} ${user.lastName} ro'yxatdan o'tdi. Ko'rib chiqing.`,
      link:  '/admin/applications',
    });

    const io = req.app.get('io');
    if (io) {
      io.to('admin_room').emit('new_application', {
        userId:    user._id,
        firstName: user.firstName,
        lastName:  user.lastName,
        email:     user.email,
        role:      user.role,
        createdAt: user.createdAt,
      });
      io.to('admin_room').emit('new_notification', notif);
    }
  }

  res.status(200).json({
    success: true,
    message: 'Email tasdiqlandi! Ariza yuborildi.',
    userId:  user._id,
  });
});

// POST /api/v1/auth/send-login-otp
exports.sendLoginOtp = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return next(new AppError('Email kiritilishi shart.', 400));
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return next(new AppError("Email formati noto'g'ri.", 400));
  }

  const cleanEmail = sanitizeStr(email, 254).toLowerCase();

  const user = await User.findOne({ email: cleanEmail }).select('+loginOtp +loginOtpExpires');

  // Don't reveal whether email exists (generic success)
  if (!user) {
    return res.status(200).json({
      success: true,
      message: 'Kirish kodi emailga yuborildi (agar akkaunt mavjud bo\'lsa).',
    });
  }

  // Status checks
  if (user.applicationStatus === 'pre_register') {
    return next(new AppError("Ro'yxatdan o'tishni davom eting.", 403));
  }
  if (user.applicationStatus === 'pending') {
    return next(new AppError("Arizangiz ko'rib chiqilmoqda. Iltimos, kuting.", 403));
  }
  if (user.applicationStatus === 'rejected') {
    const msg = user.rejectionReason
      ? `Arizangiz rad etildi: ${user.rejectionReason}`
      : "Arizangiz rad etildi. Murojaat uchun biz bilan bog'laning.";
    return next(new AppError(msg, 403));
  }
  if (!user.isActive || user.isBlocked) {
    return next(new AppError('Akkaunt bloklangan. Murojaat qiling.', 403));
  }

  // Generate login OTP
  const otp = user.createLoginOtp();
  await user.save({ validateBeforeSave: false });

  // Send OTP email
  try {
    await sendEmail({
      to: user.email,
      subject: `${otp} — Adblogger.uz kirish kodi`,
      html: loginOtpTemplate(user.firstName, otp),
    });
  } catch {
    return next(new AppError("Email yuborishda xatolik yuz berdi. Keyinroq urinib ko'ring.", 500));
  }

  res.status(200).json({
    success: true,
    message: 'Kirish kodi emailga yuborildi.',
  });
});

// POST /api/v1/auth/verify-login-otp
exports.verifyLoginOtp = catchAsync(async (req, res, next) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return next(new AppError('Email va kod kiritilishi shart.', 400));
  }

  const cleanEmail = sanitizeStr(email, 254).toLowerCase();

  const user = await User.findOne({ email: cleanEmail }).select('+loginOtp +loginOtpExpires');
  if (!user) {
    return next(new AppError("Email yoki kod noto'g'ri.", 401));
  }

  // Check expiry
  if (!user.loginOtpExpires || user.loginOtpExpires < Date.now()) {
    return next(new AppError('OTP kodi muddati tugagan. Yangi kod so\'rang.', 400));
  }

  // Verify OTP
  const hashedInput = crypto.createHash('sha256').update(String(otp)).digest('hex');
  if (hashedInput !== user.loginOtp) {
    return next(new AppError("Email yoki kod noto'g'ri.", 401));
  }

  // Clear OTP fields
  user.loginOtp = undefined;
  user.loginOtpExpires = undefined;
  await user.save({ validateBeforeSave: false });

  sendTokenResponse(user, 200, res);
});

// POST /api/v1/auth/login
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Email va parol kiritilishi shart.', 400));
  }

  const user = await User.findOne({ email }).select('+password');
  if (!user || !user.password || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Email yoki parol noto'g'ri.", 401));
  }

  // Check application status
  if (user.applicationStatus === 'pre_register') {
    return next(new AppError("Ro'yxatdan o'tishni davom eting.", 403));
  }

  if (user.applicationStatus === 'pending') {
    return next(new AppError('Arizangiz hali ko\'rib chiqilmagan. Iltimos, kuting.', 403));
  }

  if (user.applicationStatus === 'rejected') {
    return next(
      new AppError(
        user.rejectionReason
          ? `Arizangiz rad etildi: ${user.rejectionReason}`
          : "Arizangiz rad etildi. Murojaat uchun biz bilan bog'laning.",
        403
      )
    );
  }

  if (!user.isActive) {
    return next(new AppError('Akkauntingiz bloklangan.', 403));
  }

  sendTokenResponse(user, 200, res);
});

// POST /api/v1/auth/admin-login
exports.adminLogin = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Email va parol kiritilishi shart.', 400));
  }

  const user = await User.findOne({ email, role: 'admin' }).select('+password');
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Admin email yoki parol noto'g'ri.", 401));
  }

  sendTokenResponse(user, 200, res);
});

// GET /api/v1/auth/me
exports.getMe = catchAsync(async (req, res) => {
  const user = await User.findById(req.user._id);
  res.status(200).json({ success: true, data: user });
});

// PATCH /api/v1/auth/update-password
exports.updatePassword = catchAsync(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id).select('+password');
  if (!(await user.correctPassword(currentPassword, user.password))) {
    return next(new AppError("Joriy parol noto'g'ri.", 401));
  }

  user.password = newPassword;
  await user.save();

  sendTokenResponse(user, 200, res);
});

// POST /api/v1/auth/forgot-password
exports.forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('Bu email bilan foydalanuvchi topilmadi.', 404));
  }

  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  const resetURL = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

  try {
    await sendEmail({
      to: user.email,
      subject: 'Parolni tiklash (10 daqiqa amal qiladi)',
      html: `<p>Parolni tiklash uchun quyidagi havolani bosing:</p>
             <a href="${resetURL}">${resetURL}</a>
             <p>Agar siz so'rov bermagan bo'lsangiz, bu emailni e'tiborsiz qoldiring.</p>`,
    });

    res.status(200).json({ success: true, message: 'Reset token emailga yuborildi.' });
  } catch {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new AppError("Email yuborishda xatolik. Keyinroq urinib ko'ring.", 500));
  }
});

// GET /api/v1/auth/check-status/:userId — Public, for pending approval page
exports.checkApplicationStatus = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.userId).select(
    'applicationStatus rejectionReason profileStatus profileRejectionReason onboardingStep firstName'
  );
  if (!user) return next(new AppError('Foydalanuvchi topilmadi.', 404));

  res.status(200).json({
    success: true,
    applicationStatus:     user.applicationStatus,
    rejectionReason:       user.rejectionReason || '',
    profileStatus:         user.profileStatus || 'approved',
    profileRejectionReason: user.profileRejectionReason || '',
    onboardingStep:        user.onboardingStep,
  });
});

// PATCH /api/v1/auth/complete-onboarding — Step 2 → Step 3
exports.completeOnboarding = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  if (!user) return next(new AppError('Foydalanuvchi topilmadi.', 404));
  if (user.onboardingStep >= 3 && user.profileStatus === 'pending_review') {
    return next(new AppError('Profil ko\'rib chiqilmoqda.', 400));
  }
  if (user.onboardingStep === 4) {
    return next(new AppError('Profil allaqachon to\'ldirilgan.', 400));
  }

  if (user.role === 'blogger') {
    const { bio, platforms, socialLinks, categories, services, followers, followersRange, pricing, location, website } = req.body;
    const blogger = await Blogger.findOne({ user: user._id });
    if (!blogger) return next(new AppError('Blogger profili topilmadi.', 404));

    if (bio)             blogger.bio           = String(bio).trim().slice(0, 500);
    if (platforms)       blogger.platforms     = Array.isArray(platforms) ? platforms : [platforms];
    if (socialLinks)     blogger.socialLinks   = { ...blogger.socialLinks.toObject?.() || blogger.socialLinks, ...socialLinks };
    if (categories)      blogger.categories    = Array.isArray(categories) ? categories : [categories];
    if (services)        blogger.services      = Array.isArray(services) ? services : [services];
    if (followers !== undefined) blogger.followers = Number(followers) || 0;
    if (followersRange)  blogger.followersRange = followersRange;
    if (pricing)         blogger.pricing       = { ...blogger.pricing?.toObject?.() || blogger.pricing, ...pricing };
    if (location)        blogger.location      = location;
    if (website)         blogger.website       = website;
    await blogger.save();
  } else if (user.role === 'business') {
    const { bio, companyName, phone } = req.body;
    if (bio)          user.bio         = String(bio).trim().slice(0, 500);
    if (companyName)  user.companyName = String(companyName).trim();
    if (phone)        user.phone       = phone;
  }

  // Set profile to pending_review (second approval needed)
  user.onboardingStep = 3;
  user.profileStatus  = 'pending_review';
  await user.save({ validateBeforeSave: false });

  // Notify admin about profile review needed
  const admin = await User.findOne({ role: 'admin' });
  if (admin) {
    const adminNotif = await Notification.create({
      user:  admin._id,
      type:  'new_application',
      title: 'Profil ko\'rib chiqish',
      body:  `${user.firstName} ${user.lastName} profilini to'ldirdi. Ko'rib chiqing.`,
      link:  '/admin/applications?tab=profile_review',
    });

    const io = req.app.get('io');
    if (io) {
      io.to('admin_room').emit('new_profile_review', {
        userId: String(user._id),
        name:   `${user.firstName} ${user.lastName}`,
        role:   user.role,
      });
      io.to('admin_room').emit('user_onboarding_step', {
        userId: String(user._id),
        step:   3,
        name:   `${user.firstName} ${user.lastName}`,
      });
      io.to('admin_room').emit('new_notification', adminNotif);
    }
  }

  // Notify the user that profile is under review
  const userNotif = await Notification.create({
    user:  user._id,
    type:  'info',
    title: 'Profilingiz ko\'rib chiqilmoqda',
    body:  'Profilingiz admin tomonidan ko\'rib chiqilmoqda. Tez orada javob olasiz.',
    link:  '/profil-tasdiqlash-kutilmoqda',
  });

  const io = req.app.get('io');
  if (io) {
    io.to(`user_${user._id}`).emit('new_notification', userNotif);
  }

  const updatedUser = await User.findById(user._id);
  res.status(200).json({ success: true, data: updatedUser });
});

// PATCH /api/v1/auth/reset-password/:token
exports.resetPassword = catchAsync(async (req, res, next) => {
  const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new AppError("Token noto'g'ri yoki muddati tugagan.", 400));
  }

  user.password = req.body.password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  sendTokenResponse(user, 200, res);
});
