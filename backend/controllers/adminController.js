const User = require('../models/User');
const Blogger = require('../models/Blogger');
const Ad = require('../models/Ad');
const BlogPost = require('../models/BlogPost');
const Campaign = require('../models/Campaign');
const Contact = require('../models/Contact');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const { generateToken } = require('../utils/generateToken');

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
    Ad.find().sort('-createdAt').limit(5).populate('user', 'firstName lastName').select('type title companyName status createdAt'),
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
      },
      recentUsers,
      recentAds,
      monthlyRegistrations,
    },
  });
});

// GET /api/v1/admin/applications — Kutilayotgan arizalar
exports.getPendingApplications = catchAsync(async (req, res) => {
  const { status = 'pending', page = 1, limit = 20 } = req.query;
  const skip = (page - 1) * limit;

  const filter = {};
  if (status === 'all') {
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
      .select('firstName lastName email phone role applicationStatus rejectionReason createdAt avatar'),
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
  await user.save({ validateBeforeSave: false });

  // Generate auth token for instant login via socket
  const token = generateToken(user._id);

  const userObj = {
    _id:       user._id,
    firstName: user.firstName,
    lastName:  user.lastName,
    email:     user.email,
    phone:     user.phone,
    role:      user.role,
    avatar:    user.avatar,
    isVerified: user.isVerified,
  };

  // Emit to user's socket room — they get logged in instantly
  const io = req.app.get('io');
  if (io) {
    io.to(`user_${user._id}`).emit('application_approved', { token, user: userObj });
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

  res.status(200).json({
    success: true,
    message: `${user.firstName} ${user.lastName} arizasi rad etildi.`,
  });
});
