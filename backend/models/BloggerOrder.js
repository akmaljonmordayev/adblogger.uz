const mongoose = require('mongoose');

const bloggerOrderSchema = new mongoose.Schema(
  {
    blogger:        { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    business:       { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    bloggerProfile: { type: mongoose.Schema.Types.ObjectId, ref: 'Blogger' },
    projectName:    { type: String, trim: true, maxlength: 200, default: '' },
    services:       [{ type: String, enum: ['Post', 'Story', 'Reel', 'Video', 'Live', 'Unboxing'] }],
    platforms:      [{ type: String, enum: ['instagram', 'youtube', 'telegram', 'tiktok'] }],
    brief:          { type: String, trim: true, maxlength: 2000, default: '' },
    budget:         { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['pending', 'read', 'accepted', 'rejected', 'in_progress', 'completed'],
      default: 'pending',
    },
    lastMessage:    { type: String, default: '' },
    lastMessageAt:  { type: Date },
    bloggerUnread:  { type: Number, default: 0 },
    businessUnread: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('BloggerOrder', bloggerOrderSchema);
