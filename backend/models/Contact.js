const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema(
  {
    userId:  { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name:    { type: String, required: true, trim: true },
    email:   { type: String, required: true, trim: true, lowercase: true },
    phone:   { type: String, trim: true },
    role:    { type: String, enum: ['blogger', 'business', 'other'], default: 'other' },
    subject: { type: String, required: true, trim: true },
    message: { type: String, required: true, maxlength: 2000 },
    status:  { type: String, enum: ['new', 'read', 'responded'], default: 'new' },
    adminNote: { type: String },
    reply:   { type: String },
    repliedAt: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Contact', contactSchema);
