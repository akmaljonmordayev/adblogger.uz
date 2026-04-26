const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema(
  {
    name:    { type: String, required: true, trim: true },
    email:   { type: String, required: true, trim: true, lowercase: true },
    phone:   { type: String, trim: true },
    subject: { type: String, required: true, trim: true },
    message: { type: String, required: true, maxlength: 2000 },
    status:  { type: String, enum: ['new', 'read', 'responded'], default: 'new' },
    adminNote: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Contact', contactSchema);
