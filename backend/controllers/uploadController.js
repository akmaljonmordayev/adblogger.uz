const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// POST /api/v1/upload
exports.uploadImages = catchAsync(async (req, res, next) => {
  if (!req.files || req.files.length === 0) {
    return next(new AppError("Rasm yuklanmadi.", 400));
  }

  const urls = req.files.map(f => f.path);

  res.status(200).json({ success: true, urls });
});
