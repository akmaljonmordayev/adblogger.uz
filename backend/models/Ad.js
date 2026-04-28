const mongoose = require('mongoose');

const adSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['blogger', 'business'], required: true },

    // ── Blogger Ad fields ──────────────────────────────────────────────────
    title:    { type: String, trim: true },
    description: { type: String, maxlength: 1000 },
    platforms: [{ type: String, enum: ['instagram', 'youtube', 'telegram', 'tiktok'] }],
    services:  [{ type: String, enum: ['Post', 'Story', 'Reel', 'Video', 'Live', 'Unboxing'] }],
    niche:     [{ type: String, enum: ['Tech', 'Lifestyle', 'Beauty', 'Food', 'Sports', 'Travel', 'Education', 'Business', 'Gaming', 'Music', 'Other'] }],
    followersRange: {
      type: String,
      enum: ['1K-10K', '10K-50K', '50K-100K', '100K-500K', '500K-1M', '1M+'],
    },
    pricing: {
      post:  { type: Number },
      story: { type: Number },
      video: { type: Number },
    },
    portfolio: { type: String },

    // ── Business Ad fields ─────────────────────────────────────────────────
    companyName:    { type: String, trim: true },
    contactPerson:  { type: String, trim: true },
    businessType: {
      type: String,
      enum: ['Manufacturing', 'Retail', 'Restaurant', 'Beauty', 'RealEstate', 'Education', 'Tech', 'Tourism', 'Finance', 'Other'],
    },
    productName:       { type: String, trim: true },
    productDescription:{ type: String, maxlength: 1000 },
    targetPlatforms:   [{ type: String, enum: ['instagram', 'youtube', 'telegram', 'tiktok'] }],
    bloggerTypesNeeded:[{ type: String, enum: ['Lifestyle', 'Food', 'Beauty', 'Tech', 'Travel', 'Sports', 'Business', 'Any'] }],
    targetAudience:    { type: String },
    budget: {
      range:  { type: String, enum: ['500K-1M', '1M-3M', '3M-5M', '5M-10M', '10M+', 'Negotiable'] },
      min:    { type: Number },
      max:    { type: Number },
    },
    campaignDuration:  { type: String },
    campaignGoal:      { type: String },
    requirements:      { type: String },

    // ── Common fields ──────────────────────────────────────────────────────
    location: { type: String, default: '' },
    images:   [{ type: String }],
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'active', 'completed'],
      default: 'pending',
    },
    views:    { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },

    // Contact info
    phone: { type: String },
    email: { type: String },
  },
  { timestamps: true }
);

adSchema.index({ type: 1, status: 1, createdAt: -1 });
adSchema.index({ niche: 1 });
adSchema.index({ platforms: 1 });

module.exports = mongoose.model('Ad', adSchema);
