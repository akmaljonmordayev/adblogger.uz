const mongoose = require('mongoose');

const siteReviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // null = manual/admin entry
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, maxlength: 1000, default: '' },
    isApproved: { type: Boolean, default: true },
    isManual: { type: Boolean, default: false }, // admin-created testimonials
    // Denormalized display fields (for manual entries or caching)
    displayName:   { type: String, default: '' },
    displayRole:   { type: String, default: '' },
    displayAvatar: { type: String, default: '' },
  },
  { timestamps: true }
);

// One review per user (skip for manual entries)
siteReviewSchema.index({ user: 1 }, { unique: true, partialFilterExpression: { user: { $exists: true, $ne: null } } });

module.exports = mongoose.model('SiteReview', siteReviewSchema);
