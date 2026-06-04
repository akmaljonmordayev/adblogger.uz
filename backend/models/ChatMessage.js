const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema(
  {
    application: { type: mongoose.Schema.Types.ObjectId, ref: 'AdApplication' },
    order:       { type: mongoose.Schema.Types.ObjectId, ref: 'BloggerOrder' },
    sender:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    text:        { type: String, required: true, maxlength: 2000 },
    isRead:      { type: Boolean, default: false },
    edited:      { type: Boolean, default: false },
    deleted:     { type: Boolean, default: false },
  },
  { timestamps: true }
);

chatMessageSchema.index({ application: 1, createdAt: 1 });
chatMessageSchema.index({ order: 1, createdAt: 1 });

module.exports = mongoose.model('ChatMessage', chatMessageSchema);
