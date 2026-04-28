const mongoose = require('mongoose');

const careerSchema = new mongoose.Schema(
  {
    title:       { type: String, required: true, trim: true },
    department:  { type: String, required: true },
    location:    { type: String, default: 'Toshkent, O\'zbekiston' },
    type:        { type: String, enum: ['full-time', 'part-time', 'remote', 'contract'], default: 'full-time' },
    description: { type: String, required: true },
    requirements:[{ type: String }],
    benefits:    [{ type: String }],
    salaryRange: { min: Number, max: Number, currency: { type: String, default: 'USD' } },
    deadline:    { type: Date },
    isActive:    { type: Boolean, default: true },
    applyLink:   { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Career', careerSchema);
