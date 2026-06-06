const mongoose = require('mongoose');

const adApplicationSchema = new mongoose.Schema(
  {
    ad:        { type: mongoose.Schema.Types.ObjectId, ref: 'Ad', required: true },
    adOwner:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    applicant: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    message:   { type: String, maxlength: 1000, default: '' },
    status: {
      type: String,
      enum: ['pending', 'read', 'accepted', 'rejected'],
      default: 'pending',
    },
    lastMessage:    { type: String, default: '' },
    lastMessageAt:  { type: Date },
    ownerUnread:         { type: Number, default: 0 },
    applicantUnread:     { type: Number, default: 0 },
    deletedForOwner:     { type: Boolean, default: false },
    deletedForApplicant: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Har bir foydalanuvchi bitta e'longa faqat bitta zayavka yuborishi mumkin
adApplicationSchema.index({ ad: 1, applicant: 1 }, { unique: true });
adApplicationSchema.index({ adOwner: 1, updatedAt: -1 });
adApplicationSchema.index({ applicant: 1, updatedAt: -1 });

module.exports = mongoose.model('AdApplication', adApplicationSchema);
