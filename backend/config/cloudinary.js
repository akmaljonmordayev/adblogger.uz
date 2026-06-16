const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const { S3Client } = require('@aws-sdk/client-s3');
const multerS3 = require('multer-s3');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// ─── Cloudinary config ────────────────────────────────────────────────────────
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ─── Storage type detection ───────────────────────────────────────────────────
const isSupabaseConfigured =
  process.env.SUPABASE_URL &&
  process.env.SUPABASE_SERVICE_KEY &&
  process.env.SUPABASE_BUCKET;

const isB2Configured =
  process.env.B2_KEY_ID &&
  process.env.B2_APPLICATION_KEY &&
  process.env.B2_BUCKET_NAME &&
  process.env.B2_REGION;

const isCloudinaryConfigured =
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_CLOUD_NAME !== 'your_cloud_name' &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_KEY !== 'your_api_key';

// Priority: Supabase → B2 → Cloudinary → Local disk
const storageType = isSupabaseConfigured
  ? 'supabase'
  : isB2Configured
  ? 'b2'
  : isCloudinaryConfigured
  ? 'cloudinary'
  : 'local';

// ─── Backblaze B2 (S3-compatible) ────────────────────────────────────────────
let b2Client;
if (isB2Configured) {
  b2Client = new S3Client({
    endpoint: `https://s3.${process.env.B2_REGION}.backblazeb2.com`,
    region: process.env.B2_REGION,
    credentials: {
      accessKeyId: process.env.B2_KEY_ID,
      secretAccessKey: process.env.B2_APPLICATION_KEY,
    },
  });
}

// ─── Local disk storage (fallback) ───────────────────────────────────────────
const UPLOAD_DIR = path.join(__dirname, '../public/uploads');
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const diskStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${unique}${ext}`);
  },
});

// ─── Image filter ─────────────────────────────────────────────────────────────
const imageFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (allowed.includes(file.mimetype)) cb(null, true);
  else cb(new Error('Faqat rasm fayllar qabul qilinadi (jpg, png, webp)'));
};

// ─── Storage factory ──────────────────────────────────────────────────────────
const createStorage = (folder) => {
  if (isSupabaseConfigured) {
    // Supabase: buffer orqali yuklaymiz — memoryStorage ishlatamiz
    return multer.memoryStorage();
  }

  if (isB2Configured) {
    return multerS3({
      s3: b2Client,
      bucket: process.env.B2_BUCKET_NAME,
      contentType: multerS3.AUTO_CONTENT_TYPE,
      acl: 'public-read',
      key: (req, file, cb) => {
        const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        const ext = path.extname(file.originalname).toLowerCase();
        cb(null, `${folder}/${unique}${ext}`);
      },
    });
  }

  if (isCloudinaryConfigured) {
    return new CloudinaryStorage({
      cloudinary,
      params: {
        folder: `adblogger/${folder}`,
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
        transformation: [{ width: 1200, crop: 'limit', quality: 'auto' }],
      },
    });
  }

  return diskStorage;
};

const uploadAvatar    = multer({ storage: createStorage('avatars'), limits: { fileSize: 2 * 1024 * 1024 }, fileFilter: imageFilter });
const uploadBlogImage = multer({ storage: createStorage('blogs'),   limits: { fileSize: 5 * 1024 * 1024 }, fileFilter: imageFilter });
const uploadGeneral   = multer({ storage: createStorage('general'), limits: { fileSize: 5 * 1024 * 1024 }, fileFilter: imageFilter });

module.exports = {
  cloudinary,
  uploadAvatar,
  uploadBlogImage,
  uploadGeneral,
  storageType,
  isCloudinaryConfigured,
};
