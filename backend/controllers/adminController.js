const User = require('../models/User');
const Blogger = require('../models/Blogger');
const Ad = require('../models/Ad');
const BlogPost = require('../models/BlogPost');
const Campaign = require('../models/Campaign');
const Contact = require('../models/Contact');
const Notification = require('../models/Notification');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const { generateToken } = require('../utils/generateToken');
const sendEmail = require('../utils/sendEmail');
const { applicationApprovedTemplate, applicationRejectedTemplate, profileApprovedTemplate, profileRejectedTemplate } = sendEmail;

// GET /api/v1/admin/dashboard
exports.getDashboardStats = catchAsync(async (req, res) => {
  const [
    totalUsers,
    totalBloggers,
    totalAds,
    totalBlogs,
    totalCampaigns,
    pendingAds,
    newContacts,
    completedCampaigns,
    pendingApplications,
    recentUsers,
    recentAds,
    topBloggers,
    categoryBreakdown,
    recentBusinesses,
    totalBusinessmen,
  ] = await Promise.all([
    User.countDocuments({ role: { $ne: 'admin' }, applicationStatus: 'approved' }),
    Blogger.countDocuments({ isActive: true }),
    Ad.countDocuments(),
    BlogPost.countDocuments({ isPublished: true }),
    Campaign.countDocuments(),
    Ad.countDocuments({ status: 'pending' }),
    Contact.countDocuments({ status: 'new' }),
    Campaign.countDocuments({ status: 'completed' }),
    User.countDocuments({ applicationStatus: 'pending' }),
    User.find({ role: { $ne: 'admin' }, applicationStatus: 'approved' }).sort('-createdAt').limit(5).select('firstName lastName email role createdAt'),
    Ad.find().sort('-createdAt').limit(5).populate('user', 'firstName lastName').select('type title companyName platforms targetPlatforms status createdAt'),
    Blogger.find({ isActive: true })
      .sort({ followers: -1, rating: -1 })
      .limit(5)
      .populate('user', 'firstName lastName avatar')
      .select('user handle platforms followers engagementRate categories rating stats'),
    Blogger.aggregate([
      { $match: { isActive: true } },
      { $unwind: '$categories' },
      { $group: { _id: '$categories', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 6 },
    ]),
    User.find({ role: 'business', applicationStatus: 'approved' })
      .sort('-createdAt')
      .limit(5)
      .select('firstName lastName email createdAt'),
    User.countDocuments({ role: 'business', applicationStatus: 'approved' }),
  ]);

  // Monthly registrations for current year
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const monthlyRegistrations = await User.aggregate([
    { $match: { createdAt: { $gte: startOfYear }, role: { $ne: 'admin' } } },
    { $group: { _id: { $month: '$createdAt' }, count: { $sum: 1 } } },
    { $sort: { _id: 1 } },
  ]);

  res.status(200).json({
    success: true,
    data: {
      stats: {
        totalUsers,
        totalBloggers,
        totalAds,
        totalBlogs,
        totalCampaigns,
        pendingAds,
        newContacts,
        completedCampaigns,
        pendingApplications,
        totalBusinessmen,
      },
      recentUsers,
      recentAds,
      monthlyRegistrations,
      topBloggers,
      categoryBreakdown,
      recentBusinesses,
    },
  });
});

// GET /api/v1/admin/statistics
exports.getStatistics = catchAsync(async (req, res) => {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const last12Months = new Date(now);
  last12Months.setMonth(last12Months.getMonth() - 11);
  last12Months.setDate(1);
  last12Months.setHours(0, 0, 0, 0);

  const [
    totalBloggers,
    totalBusinessmen,
    totalAds,
    totalBlogs,
    totalCampaigns,
    totalContacts,
    pendingAds,
    approvedAds,
    activeAds,
    rejectedAds,
    completedAds,
    pendingApplications,
    monthlyRegs,
    platformDist,
    categoryDist,
    adStatusDist,
    userRoleDist,
    topBloggers,
    monthlyAdsDist,
  ] = await Promise.all([
    Blogger.countDocuments({ isActive: true }),
    User.countDocuments({ role: 'business', applicationStatus: 'approved' }),
    Ad.countDocuments(),
    BlogPost.countDocuments({ isPublished: true }),
    Campaign.countDocuments(),
    Contact.countDocuments(),
    Ad.countDocuments({ status: 'pending' }),
    Ad.countDocuments({ status: 'approved' }),
    Ad.countDocuments({ status: 'active' }),
    Ad.countDocuments({ status: 'rejected' }),
    Ad.countDocuments({ status: 'completed' }),
    User.countDocuments({ applicationStatus: 'pending' }),
    // Monthly registrations last 12 months
    User.aggregate([
      { $match: { createdAt: { $gte: last12Months }, role: { $ne: 'admin' } } },
      { $group: { _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } }, count: { $sum: 1 } } },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]),
    // Platform distribution
    Blogger.aggregate([
      { $match: { isActive: true } },
      { $unwind: '$platforms' },
      { $group: { _id: '$platforms', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]),
    // Category distribution
    Blogger.aggregate([
      { $match: { isActive: true } },
      { $unwind: '$categories' },
      { $group: { _id: '$categories', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 8 },
    ]),
    // Ad status distribution
    Ad.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]),
    // User role distribution
    User.aggregate([
      { $match: { role: { $ne: 'admin' }, applicationStatus: 'approved' } },
      { $group: { _id: '$role', count: { $sum: 1 } } },
    ]),
    // Top 10 bloggers
    Blogger.find({ isActive: true })
      .sort({ followers: -1 })
      .limit(10)
      .populate('user', 'firstName lastName avatar')
      .select('user handle platforms followers engagementRate rating categories'),
    // Monthly ads created last 12 months
    Ad.aggregate([
      { $match: { createdAt: { $gte: last12Months } } },
      { $group: { _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } }, count: { $sum: 1 } } },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]),
  ]);

  res.status(200).json({
    success: true,
    data: {
      overview: {
        totalBloggers,
        totalBusinessmen,
        totalAds,
        totalBlogs,
        totalCampaigns,
        totalContacts,
        pendingApplications,
      },
      adStatus: { pendingAds, approvedAds, activeAds, rejectedAds, completedAds },
      monthlyRegs,
      platformDist,
      categoryDist,
      adStatusDist,
      userRoleDist,
      topBloggers,
      monthlyAdsDist,
    },
  });
});

// GET /api/v1/admin/applications — Arizalar ro'yxati
exports.getPendingApplications = catchAsync(async (req, res) => {
  const { status = 'pending', page = 1, limit = 20 } = req.query;
  const skip = (page - 1) * limit;

  const filter = {};

  if (status === 'profile_review') {
    // Users who have been approved (application) but whose profile is pending review
    filter.applicationStatus = 'approved';
    filter.profileStatus = 'pending_review';
  } else if (status === 'all') {
    filter.applicationStatus = { $in: ['pending', 'approved', 'rejected'] };
  } else {
    filter.applicationStatus = status;
  }

  filter.role = { $ne: 'admin' };

  const [applications, total] = await Promise.all([
    User.find(filter)
      .sort('-createdAt')
      .skip(skip)
      .limit(Number(limit))
      .select('firstName lastName email phone role applicationStatus rejectionReason profileStatus profileRejectionReason onboardingStep createdAt avatar'),
    User.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    data: applications,
    pagination: {
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
    },
  });
});

// PATCH /api/v1/admin/applications/:id/approve — Arizani tasdiqlash
exports.approveApplication = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) return next(new AppError('Foydalanuvchi topilmadi.', 404));
  if (user.role === 'admin') return next(new AppError('Admin hisobini o\'zgartirish mumkin emas.', 403));

  user.applicationStatus = 'approved';
  user.rejectionReason = '';
  user.onboardingStep = 2;
  await user.save({ validateBeforeSave: false });

  // Generate auth token for instant login via socket
  const token = generateToken(user._id);

  const userObj = {
    _id:           user._id,
    firstName:     user.firstName,
    lastName:      user.lastName,
    email:         user.email,
    phone:         user.phone,
    role:          user.role,
    avatar:        user.avatar,
    isVerified:    user.isVerified,
    onboardingStep: user.onboardingStep,
  };

  // Emit to user's socket room — they get logged in instantly
  const io = req.app.get('io');
  if (io) {
    io.to(`user_${user._id}`).emit('application_approved', { token, user: userObj });
    io.to('admin_room').emit('user_onboarding_step', { userId: String(user._id), step: 2, name: `${user.firstName} ${user.lastName}` });
  }

  // Send approval email
  try {
    await sendEmail({
      to: user.email,
      subject: 'Arizangiz tasdiqlandi — Adblogger.uz',
      html: applicationApprovedTemplate(user.firstName),
    });
  } catch {
    // Don't fail the request if email fails
  }

  res.status(200).json({
    success: true,
    message: `${user.firstName} ${user.lastName} arizasi tasdiqlandi.`,
    data: userObj,
  });
});

// PATCH /api/v1/admin/applications/:id/reject — Arizani rad etish
exports.rejectApplication = catchAsync(async (req, res, next) => {
  const { reason } = req.body;

  const user = await User.findById(req.params.id);
  if (!user) return next(new AppError('Foydalanuvchi topilmadi.', 404));
  if (user.role === 'admin') return next(new AppError('Admin hisobini o\'zgartirish mumkin emas.', 403));

  user.applicationStatus = 'rejected';
  user.rejectionReason = reason || '';
  await user.save({ validateBeforeSave: false });

  // Emit rejection to user's socket room
  const io = req.app.get('io');
  if (io) {
    io.to(`user_${user._id}`).emit('application_rejected', {
      userId: user._id,
      reason: user.rejectionReason,
    });
  }

  // Send rejection email
  try {
    await sendEmail({
      to: user.email,
      subject: 'Ariza natijasi — Adblogger.uz',
      html: applicationRejectedTemplate(user.firstName, reason),
    });
  } catch {
    // Don't fail the request if email fails
  }

  res.status(200).json({
    success: true,
    message: `${user.firstName} ${user.lastName} arizasi rad etildi.`,
  });
});

// PATCH /api/v1/admin/applications/:id/approve-profile — Profil tasdiqlash
exports.approveProfile = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) return next(new AppError('Foydalanuvchi topilmadi.', 404));

  if (user.profileStatus !== 'pending_review') {
    return next(new AppError('Bu foydalanuvchi profil tasdiqlash kutmayotir.', 400));
  }

  user.profileStatus  = 'approved';
  user.profileRejectionReason = '';
  user.onboardingStep = 4;
  await user.save({ validateBeforeSave: false });

  // Emit to user socket
  const io = req.app.get('io');
  if (io) {
    io.to(`user_${user._id}`).emit('profile_approved', {
      userId:  String(user._id),
      message: 'Profilingiz tasdiqlandi!',
    });
  }

  // Create notification for user
  const notif = await Notification.create({
    user:  user._id,
    type:  'verify',
    title: '🎉 Akkauntingiz faollashdi!',
    body:  'Profilingiz admin tomonidan tasdiqlandi. Platformadan to\'liq foydalanishingiz mumkin!',
    link:  '/',
  });

  if (io) {
    io.to(`user_${user._id}`).emit('new_notification', notif);
  }

  // Send approval email
  try {
    await sendEmail({
      to: user.email,
      subject: 'Profilingiz tasdiqlandi — Adblogger.uz',
      html: profileApprovedTemplate(user.firstName),
    });
  } catch {
    // Don't fail request if email fails
  }

  res.status(200).json({
    success: true,
    message: `${user.firstName} ${user.lastName} profili tasdiqlandi.`,
  });
});

// PATCH /api/v1/admin/applications/:id/reject-profile — Profilni rad etish
exports.rejectProfile = catchAsync(async (req, res, next) => {
  const { reason } = req.body;

  const user = await User.findById(req.params.id);
  if (!user) return next(new AppError('Foydalanuvchi topilmadi.', 404));

  user.profileStatus = 'rejected';
  user.profileRejectionReason = reason || '';
  // Reset back to step 2 so user can re-fill
  user.onboardingStep = 2;
  await user.save({ validateBeforeSave: false });

  const io = req.app.get('io');
  if (io) {
    io.to(`user_${user._id}`).emit('profile_rejected', {
      userId: String(user._id),
      reason: user.profileRejectionReason,
    });
  }

  // Create notification for user
  const notif = await Notification.create({
    user:  user._id,
    type:  'info',
    title: 'Profilingiz rad etildi',
    body:  reason
      ? `Profilingiz rad etildi: ${reason}. Ma'lumotlarni to'g'rilab, qayta yuboring.`
      : 'Profilingiz rad etildi. Ma\'lumotlarni to\'g\'rilab, qayta yuboring.',
    link:  '/profil-toldirish',
  });

  if (io) {
    io.to(`user_${user._id}`).emit('new_notification', notif);
  }

  // Send rejection email
  try {
    await sendEmail({
      to: user.email,
      subject: 'Profil natijasi — Adblogger.uz',
      html: profileRejectedTemplate(user.firstName, reason),
    });
  } catch {
    // Don't fail request if email fails
  }

  res.status(200).json({
    success: true,
    message: `${user.firstName} ${user.lastName} profili rad etildi.`,
  });
});
