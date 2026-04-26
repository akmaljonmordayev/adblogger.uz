const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    slug: { type: String, unique: true, lowercase: true, trim: true },
    description: { type: String, maxlength: 300 },
    icon:  { type: String, default: '' },
    color: { type: String, default: '#6366f1' },
    bloggerCount: { type: Number, default: 0 },
    adCount:      { type: Number, default: 0 },
    isFeatured:   { type: Boolean, default: false },
    order:        { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Category', categorySchema);
