const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const createStorage = (folder) =>
  new CloudinaryStorage({
    cloudinary,
    params: {
      folder: `adblogger/${folder}`,
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
      transformation: [{ width: 1200, crop: 'limit', quality: 'auto' }],
    },
  });

const uploadAvatar = multer({ storage: createStorage('avatars'), limits: { fileSize: 2 * 1024 * 1024 } });
const uploadBlogImage = multer({ storage: createStorage('blogs'), limits: { fileSize: 5 * 1024 * 1024 } });
const uploadGeneral = multer({ storage: createStorage('general'), limits: { fileSize: 5 * 1024 * 1024 } });

module.exports = { cloudinary, uploadAvatar, uploadBlogImage, uploadGeneral };
