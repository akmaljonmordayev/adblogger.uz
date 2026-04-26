const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    blogger:  { type: mongoose.Schema.Types.ObjectId, ref: 'Blogger', required: true },
    reviewer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    campaign: { type: mongoose.Schema.Types.ObjectId, ref: 'Campaign' },
    rating:   { type: Number, required: true, min: 1, max: 5 },
    comment:  { type: String, maxlength: 500 },
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// One review per blogger per user
reviewSchema.index({ blogger: 1, reviewer: 1 }, { unique: true });

// Recalculate blogger rating after save/remove
reviewSchema.statics.calcAverageRating = async function (bloggerId) {
  const stats = await this.aggregate([
    { $match: { blogger: bloggerId } },
    { $group: { _id: '$blogger', avgRating: { $avg: '$rating' }, count: { $sum: 1 } } },
  ]);
  if (stats.length > 0) {
    await mongoose.model('Blogger').findByIdAndUpdate(bloggerId, {
      rating: Math.round(stats[0].avgRating * 10) / 10,
      reviewCount: stats[0].count,
    });
  } else {
    await mongoose.model('Blogger').findByIdAndUpdate(bloggerId, { rating: 0, reviewCount: 0 });
  }
};

reviewSchema.post('save', function () {
  this.constructor.calcAverageRating(this.blogger);
});

reviewSchema.post('findOneAndDelete', function (doc) {
  if (doc) doc.constructor.calcAverageRating(doc.blogger);
});

module.exports = mongoose.model('Review', reviewSchema);
