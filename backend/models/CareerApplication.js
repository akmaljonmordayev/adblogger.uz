const mongoose = require('mongoose');

const careerApplicationSchema = new mongoose.Schema(
  {
    career:    { type: mongoose.Schema.Types.ObjectId, ref: 'Career', required: true },
    name:      { type: String, required: true, trim: true },
    email:     { type: String, required: true, trim: true },
    phone:     { type: String, trim: true },
    message:   { type: String },
    status:    {
      type: String,
      enum: ['new', 'reviewing', 'accepted', 'rejected'],
      default: 'new',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('CareerApplication', careerApplicationSchema);
