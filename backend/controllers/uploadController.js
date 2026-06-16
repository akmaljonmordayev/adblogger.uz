const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const { storageType } = require('../config/cloudinary');

// Supabase client (lazy — faqat kerak bo'lganda ishlatiladi)
let supabase;
const getSupabase = () => {
  if (!supabase) {
    supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_KEY
    );
  }
  return supabase;
};

// POST /api/v1/upload
exports.uploadImages = catchAsync(async (req, res, next) => {
  if (!req.files || req.files.length === 0) {
    return next(new AppError('Rasm yuklanmadi.', 400));
  }

  let urls;

  if (storageType === 'supabase') {
    const sb = getSupabase();
    urls = await Promise.all(
      req.files.map(async (f) => {
        const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        const ext = path.extname(f.originalname).toLowerCase();
        const filePath = `uploads/${unique}${ext}`;

        const { error } = await sb.storage
          .from(process.env.SUPABASE_BUCKET)
          .upload(filePath, f.buffer, {
            contentType: f.mimetype,
            upsert: false,
          });

        if (error) throw new AppError(`Rasm yuklashda xatolik: ${error.message}`, 500);

        const { data } = sb.storage
          .from(process.env.SUPABASE_BUCKET)
          .getPublicUrl(filePath);

        return data.publicUrl;
      })
    );
  } else if (storageType === 'b2') {
    // multer-s3: f.location = public URL
    urls = req.files.map((f) => f.location);
  } else if (storageType === 'cloudinary') {
    // multer-storage-cloudinary: f.path = secure_url
    urls = req.files.map((f) => f.path);
  } else {
    // Local disk storage
    urls = req.files.map((f) => {
      const filename = path.basename(f.path);
      return `${req.protocol}://${req.get('host')}/uploads/${filename}`;
    });
  }

  res.status(200).json({ success: true, urls });
});
