const mongoose = require('mongoose');
const slugify = require('slugify');

const commentSchema = new mongoose.Schema(
  {
    user:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    text:    { type: String, required: [true, 'Izoh matni kiritilishi shart'], maxlength: 1000, trim: true },
    likes:   [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

const blogPostSchema = new mongoose.Schema(
  {
    title:      { type: String, required: [true, 'Sarlavha kiritilishi shart'], trim: true },
    slug:       { type: String, unique: true },
    excerpt:    { type: String, maxlength: 300 },
    content:    { type: String, required: [true, 'Kontent kiritilishi shart'] },
    coverImage: { type: String, default: '' },
    author:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    category: {
      type: String,
      enum: ['Tech', 'Lifestyle', 'Beauty', 'Food', 'Sports', 'Travel', 'Education', 'Business', 'Gaming', 'Music', 'Other'],
      required: true,
    },
    tags:        [{ type: String, trim: true, lowercase: true }],
    readTime:    { type: Number, default: 5 },
    views:       { type: Number, default: 0 },
    likes:       [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    comments:    [commentSchema],
    isPublished: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

blogPostSchema.pre('save', function (next) {
  if (this.isModified('title')) {
    this.slug = slugify(this.title, { lower: true, strict: true }) + '-' + Date.now();
  }
  if (this.content) {
    const words = this.content.replace(/<[^>]*>/g, '').split(/\s+/).length;
    this.readTime = Math.ceil(words / 200);
  }
  next();
});

blogPostSchema.index({ category: 1, isPublished: 1, createdAt: -1 });
blogPostSchema.index({ views: -1 });

module.exports = mongoose.model('BlogPost', blogPostSchema);
