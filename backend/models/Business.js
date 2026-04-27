const mongoose = require('mongoose');

const businessSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },

    companyName:  { type: String, trim: true, default: '' },
    companyType: {
      type: String,
      enum: ['Manufacturing', 'Retail', 'Restaurant', 'Beauty', 'RealEstate', 'Education', 'Tech', 'Tourism', 'Finance', 'Other', ''],
      default: '',
    },
    description: { type: String, maxlength: [600, 'Tavsif 600 belgidan oshmasligi kerak'], default: '' },
    website:  { type: String, default: '' },
    logo:     { type: String, default: '' },
    location: { type: String, default: '' },

    // Social / contact
    socialLinks: {
      instagram: { type: String, default: '' },
      youtube:   { type: String, default: '' },
      telegram:  { type: String, default: '' },
      tiktok:    { type: String, default: '' },
    },
    contactPhone: { type: String, default: '' },
    contactEmail: { type: String, default: '' },

    // Campaign preferences
    targetPlatforms: [{ type: String, enum: ['instagram', 'youtube', 'telegram', 'tiktok'] }],
    targetNiches: [{
      type: String,
      enum: ['Tech', 'Lifestyle', 'Beauty', 'Food', 'Sports', 'Travel', 'Education', 'Business', 'Gaming', 'Music', 'Other'],
    }],
    budgetRange: {
      type: String,
      enum: ['500K-1M', '1M-3M', '3M-5M', '5M-10M', '10M+', 'Negotiable', ''],
      default: '',
    },

    stats: {
      totalCampaigns:     { type: Number, default: 0 },
      activeCampaigns:    { type: Number, default: 0 },
      totalSpent:         { type: Number, default: 0 },
    },

    isVerified: { type: Boolean, default: false },
    isActive:   { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Business', businessSchema);
