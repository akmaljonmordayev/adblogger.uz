const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema(
  {
    blogger:  { type: mongoose.Schema.Types.ObjectId, ref: 'Blogger', required: true },
    business: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    ad:       { type: mongoose.Schema.Types.ObjectId, ref: 'Ad' },
    status: {
      type: String,
      enum: ['proposal', 'negotiating', 'agreed', 'in_progress', 'completed', 'cancelled'],
      default: 'proposal',
    },
    startDate:    { type: Date },
    endDate:      { type: Date },
    agreedPrice:  { type: Number },
    currency:     { type: String, default: 'UZS' },
    deliverables: { type: String },
    terms:        { type: String },
    notes:        { type: String },
    completedAt:  { type: Date },
  },
  { timestamps: true }
);

campaignSchema.index({ blogger: 1, status: 1 });
campaignSchema.index({ business: 1, status: 1 });

module.exports = mongoose.model('Campaign', campaignSchema);
