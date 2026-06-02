const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema(
  {
    application: { type: mongoose.Schema.Types.ObjectId, ref: 'AdApplication', required: true },
    sender:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    text:        { type: String, required: true, maxlength: 2000 },
    isRead:      { type: Boolean, default: false },
  },
  { timestamps: true }
);

chatMessageSchema.index({ application: 1, createdAt: 1 });

module.exports = mongoose.model('ChatMessage', chatMessageSchema);
