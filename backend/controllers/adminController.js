const User = require('../models/User');
const Blogger = require('../models/Blogger');
const Ad = require('../models/Ad');
const BlogPost = require('../models/BlogPost');
const Campaign = require('../models/Campaign');
const Contact = require('../models/Contact');
const catchAsync = require('../utils/catchAsync');

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
    recentUsers,
    recentAds,
  ] = await Promise.all([
    User.countDocuments({ role: { $ne: 'admin' } }),
    Blogger.countDocuments({ isActive: true }),
    Ad.countDocuments(),
    BlogPost.countDocuments({ isPublished: true }),
    Campaign.countDocuments(),
    Ad.countDocuments({ status: 'pending' }),
    Contact.countDocuments({ status: 'new' }),
    Campaign.countDocuments({ status: 'completed' }),
    User.find({ role: { $ne: 'admin' } }).sort('-createdAt').limit(5).select('firstName lastName email role createdAt'),
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
      },
      recentUsers,
      recentAds,
      monthlyRegistrations,
    },
  });
});
