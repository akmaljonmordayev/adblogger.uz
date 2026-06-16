/**
 * resolveFileUrl(folder)
 *
 * multer dan keyin ishlatiladi. Qaysi storage ishlatilayotganiga qarab
 * req.file.path ni to'g'ri public URL ga o'zgartiradi.
 *
 * Usage:
 *   router.post('/', upload.single('coverImage'), resolveFileUrl('blogs'), controller);
 */

const { createClient } = require('@supabase/supabase-js');
const path = require('path');
const { storageType } = require('../config/cloudinary');

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

module.exports = (folder = 'general') => async (req, res, next) => {
  if (!req.file) return next();

  try {
    if (storageType === 'supabase') {
      const sb = getSupabase();
      const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      const ext = path.extname(req.file.originalname).toLowerCase();
      const filePath = `${folder}/${unique}${ext}`;

      const { error } = await sb.storage
        .from(process.env.SUPABASE_BUCKET)
        .upload(filePath, req.file.buffer, {
          contentType: req.file.mimetype,
          upsert: false,
        });

      if (error) return next(new Error(`Supabase upload: ${error.message}`));

      const { data } = sb.storage
        .from(process.env.SUPABASE_BUCKET)
        .getPublicUrl(filePath);

      req.file.path = data.publicUrl;

    } else if (storageType === 'b2') {
      // multer-s3 f.location = public S3 URL
      req.file.path = req.file.location;

    } else if (storageType === 'local') {
      const filename = path.basename(req.file.path);
      req.file.path = `${req.protocol}://${req.get('host')}/uploads/${filename}`;
    }
    // cloudinary: req.file.path allaqachon to'g'ri

    next();
  } catch (err) {
    next(err);
  }
};
