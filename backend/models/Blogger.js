const mongoose = require('mongoose');

const bloggerSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    handle: { type: String, unique: true, sparse: true, trim: true, lowercase: true },
    bio: { type: String, maxlength: [500, 'Bio 500 belgidan oshmasligi kerak'] },
    platforms: {
      type: [{ type: String, enum: ['instagram', 'youtube', 'telegram', 'tiktok'] }],
      default: [],
    },
    socialLinks: {
      instagram: { type: String, default: '' },
      youtube:   { type: String, default: '' },
      telegram:  { type: String, default: '' },
      tiktok:    { type: String, default: '' },
    },
    followers: { type: Number, default: 0 },
    followersRange: {
      type: String,
      enum: ['1K-10K', '10K-50K', '50K-100K', '100K-500K', '500K-1M', '1M+'],
    },
    engagementRate: { type: Number, default: 0, min: 0, max: 100 },
    categories: [{
      type: String,
      enum: ['Tech', 'Lifestyle', 'Beauty', 'Food', 'Sports', 'Travel', 'Education', 'Business', 'Gaming', 'Music', 'Other'],
    }],
    services: [{
      type: String,
      enum: ['Post', 'Story', 'Reel', 'Video', 'Live', 'Unboxing'],
    }],
    pricing: {
      post:     { type: Number, default: 0 },
      story:    { type: Number, default: 0 },
      reel:     { type: Number, default: 0 },
      video:    { type: Number, default: 0 },
      live:     { type: Number, default: 0 },
      unboxing: { type: Number, default: 0 },
    },
    language:   [{ type: String }],
    gender: { type: String, enum: ['male', 'female', 'other', ''] },
    website: { type: String, default: '' },
    audienceAge: { type: String, default: '' },
    audienceGender: { type: String, default: '' },
    portfolio: { type: String, default: '' },
    location: { type: String, default: '' },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
    isVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    stats: {
      totalCampaigns:      { type: Number, default: 0 },
      completedCampaigns:  { type: Number, default: 0 },
      totalEarnings:       { type: Number, default: 0 },
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

bloggerSchema.index({ categories: 1, followers: -1 });
bloggerSchema.index({ platforms: 1, followers: -1 });

module.exports = mongoose.model('Blogger', bloggerSchema);
