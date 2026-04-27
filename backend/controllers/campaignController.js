const Campaign = require('../models/Campaign');
const Blogger = require('../models/Blogger');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// POST /api/v1/campaigns  — business sends proposal to blogger
exports.createCampaign = catchAsync(async (req, res, next) => {
  const { bloggerId, adId, startDate, endDate, agreedPrice, deliverables, terms, notes } = req.body;

  const blogger = await Blogger.findById(bloggerId);
  if (!blogger) return next(new AppError('Blogger topilmadi.', 404));

  const campaign = await Campaign.create({
    blogger: bloggerId,
    business: req.user._id,
    ad: adId,
    startDate,
    endDate,
    agreedPrice,
    deliverables,
    terms,
    notes,
    status: 'proposal',
  });

  res.status(201).json({ success: true, data: campaign });
});

// GET /api/v1/campaigns/my  — get current user's campaigns
exports.getMyCampaigns = catchAsync(async (req, res) => {
  const filter =
    req.user.role === 'blogger'
      ? { blogger: req.blogger?._id }
      : { business: req.user._id };

  const campaigns = await Campaign.find(filter)
    .populate('blogger', 'handle')
    .populate('business', 'firstName lastName email')
    .populate('ad', 'title type')
    .sort('-createdAt');

  res.status(200).json({ success: true, results: campaigns.length, data: campaigns });
});

// GET /api/v1/campaigns/:id
exports.getCampaign = catchAsync(async (req, res, next) => {
  const campaign = await Campaign.findById(req.params.id)
    .populate('blogger')
    .populate('business', 'firstName lastName email phone')
    .populate('ad');

  if (!campaign) return next(new AppError('Kampaniya topilmadi.', 404));

  res.status(200).json({ success: true, data: campaign });
});

// PATCH /api/v1/campaigns/:id/status
exports.updateCampaignStatus = catchAsync(async (req, res, next) => {
  const { status } = req.body;
  const allowed = ['proposal', 'negotiating', 'agreed', 'in_progress', 'completed', 'cancelled'];
  if (!allowed.includes(status)) return next(new AppError('Noto\'g\'ri status.', 400));

  const campaign = await Campaign.findById(req.params.id);
  if (!campaign) return next(new AppError('Kampaniya topilmadi.', 404));

  campaign.status = status;
  if (status === 'completed') {
    campaign.completedAt = Date.now();
    await Blogger.findByIdAndUpdate(campaign.blogger, {
      $inc: { 'stats.completedCampaigns': 1, 'stats.totalEarnings': campaign.agreedPrice || 0 },
    });
  }
  await campaign.save();

  res.status(200).json({ success: true, data: campaign });
});

// ── Admin ─────────────────────────────────────────────────────────────────────
exports.adminGetAllCampaigns = catchAsync(async (req, res) => {
  const campaigns = await Campaign.find()
    .populate('blogger', 'handle')
    .populate('business', 'firstName lastName email')
    .sort('-createdAt');

  res.status(200).json({ success: true, results: campaigns.length, data: campaigns });
});
