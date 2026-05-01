const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ['contact_reply', 'campaign', 'ad_approved', 'ad_rejected', 'review', 'verify', 'info'],
      default: 'info',
    },
    title: { type: String, required: true },
    body:  { type: String, required: true },
    read:  { type: Boolean, default: false },
    link:  { type: String, default: '/notifications' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Notification', notificationSchema);
