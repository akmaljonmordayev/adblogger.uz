const Business = require('../models/Business');
const catchAsync = require('../utils/catchAsync');
const AppError   = require('../utils/appError');

const ALLOWED = [
  'companyName', 'companyType', 'description', 'website', 'logo', 'location',
  'socialLinks', 'contactPhone', 'contactEmail',
  'targetPlatforms', 'targetNiches', 'budgetRange',
];

// GET /api/v1/business/me
exports.getMyProfile = catchAsync(async (req, res, next) => {
  const biz = await Business.findOne({ user: req.user._id })
    .populate('user', 'firstName lastName avatar email phone');

  if (!biz) {
    // Return empty profile — not an error, just first visit
    return res.status(200).json({ success: true, data: null });
  }
  res.status(200).json({ success: true, data: biz });
});

// PATCH /api/v1/business/me
exports.updateMyProfile = catchAsync(async (req, res, next) => {
  const updates = {};
  ALLOWED.forEach(f => { if (req.body[f] !== undefined) updates[f] = req.body[f]; });

  const biz = await Business.findOneAndUpdate(
    { user: req.user._id },
    { $set: updates },
    { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
  ).populate('user', 'firstName lastName avatar email phone');

  res.status(200).json({ success: true, data: biz });
});

// ── Admin ──────────────────────────────────────────────────────
exports.adminGetAll = catchAsync(async (req, res) => {
  const list = await Business.find().populate('user', 'firstName lastName email avatar');
  res.status(200).json({ success: true, results: list.length, data: list });
});
