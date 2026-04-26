const mongoose = require('mongoose');

const faqSchema = new mongoose.Schema(
  {
    question: { type: String, required: true, trim: true },
    answer:   { type: String, required: true },
    category: {
      type: String,
      enum: ['general', 'blogger', 'business', 'payment', 'technical'],
      default: 'general',
    },
    order:    { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('FAQ', faqSchema);
