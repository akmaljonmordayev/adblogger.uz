const Career            = require('../models/Career');
const CareerApplication = require('../models/CareerApplication');
const catchAsync        = require('../utils/catchAsync');
const AppError          = require('../utils/appError');

// ── Public ──────────────────────────────────────────────────────────────────────
exports.getAllCareers = catchAsync(async (req, res) => {
  const careers = await Career.find({ isActive: true }).sort('-createdAt');
  res.status(200).json({ success: true, results: careers.length, data: careers });
});

exports.getCareer = catchAsync(async (req, res, next) => {
  const career = await Career.findById(req.params.id);
  if (!career || !career.isActive) return next(new AppError('Vakansiya topilmadi.', 404));
  res.status(200).json({ success: true, data: career });
});

// Public: submit application
exports.submitApplication = catchAsync(async (req, res, next) => {
  const career = await Career.findOne({ _id: req.params.id, isActive: true });
  if (!career) return next(new AppError('Vakansiya topilmadi.', 404));
  const app = await CareerApplication.create({ career: req.params.id, ...req.body });
  res.status(201).json({ success: true, data: app });
});

// ── Admin ───────────────────────────────────────────────────────────────────────
exports.adminGetAllCareers = catchAsync(async (req, res) => {
  const careers = await Career.find().sort('-createdAt');

  // attach application counts per career
  const ids = careers.map(c => c._id);
  const counts = await CareerApplication.aggregate([
    { $match: { career: { $in: ids } } },
    { $group: { _id: '$career', total: { $sum: 1 }, newCount: { $sum: { $cond: [{ $eq: ['$status', 'new'] }, 1, 0] } } } },
  ]);
  const countMap = {};
  counts.forEach(c => { countMap[c._id.toString()] = c; });

  const data = careers.map(c => ({
    ...c.toObject(),
    appTotal:    countMap[c._id.toString()]?.total    || 0,
    appNewCount: countMap[c._id.toString()]?.newCount || 0,
  }));

  res.status(200).json({ success: true, results: data.length, data });
});

exports.createCareer = catchAsync(async (req, res) => {
  const career = await Career.create(req.body);
  res.status(201).json({ success: true, data: career });
});

exports.updateCareer = catchAsync(async (req, res, next) => {
  const career = await Career.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!career) return next(new AppError('Vakansiya topilmadi.', 404));
  res.status(200).json({ success: true, data: career });
});

exports.deleteCareer = catchAsync(async (req, res, next) => {
  const career = await Career.findByIdAndDelete(req.params.id);
  if (!career) return next(new AppError('Vakansiya topilmadi.', 404));
  // also delete all applications for this career
  await CareerApplication.deleteMany({ career: req.params.id });
  res.status(204).json({ success: true, data: null });
});

// ── Applications (admin) ────────────────────────────────────────────────────────
exports.getApplications = catchAsync(async (req, res) => {
  const apps = await CareerApplication.find({ career: req.params.id })
    .populate('career', 'title department type location')
    .sort('-createdAt');
  res.status(200).json({ success: true, results: apps.length, data: apps });
});

exports.getAllApplications = catchAsync(async (req, res) => {
  const filter = {};
  if (req.query.status) filter.status = req.query.status;

  const apps = await CareerApplication.find(filter)
    .populate('career', 'title department type location')
    .sort('-createdAt');
  res.status(200).json({ success: true, results: apps.length, data: apps });
});

exports.updateApplicationStatus = catchAsync(async (req, res, next) => {
  const app = await CareerApplication.findByIdAndUpdate(
    req.params.appId,
    { status: req.body.status },
    { new: true, runValidators: true }
  ).populate('career', 'title department');
  if (!app) return next(new AppError('Ariza topilmadi.', 404));
  res.status(200).json({ success: true, data: app });
});

exports.deleteApplication = catchAsync(async (req, res, next) => {
  const app = await CareerApplication.findByIdAndDelete(req.params.appId);
  if (!app) return next(new AppError('Ariza topilmadi.', 404));
  res.status(204).json({ success: true, data: null });
});
